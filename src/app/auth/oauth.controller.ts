import { Controller, Get, Post, Query, Body, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import type { Response, Request } from 'express';
import { OauthAuthorizeDto } from './dto/oauth-authorize.dto';
import { OauthTokenDto } from './dto/oauth-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthClient } from './oauth-client.entity';
import { OauthCode } from './oauth-code.entity';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Controller('oauth')
export class OauthController {
  constructor(
    @InjectRepository(OauthClient)
    private readonly oauthClientRepo: Repository<OauthClient>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Paso 1: Endpoint de autorización
  @Get('authorize')
  async authorize(@Query() query: OauthAuthorizeDto, @Res() res: Response, @Req() req: Request) {
    // Validar client_id y redirect_uri
    const client = await this.oauthClientRepo.findOne({ where: { clientId: query.client_id, enabled: true } });
    if (!client) {
      return res.status(400).json({ error: 'invalid_client', error_description: 'Client not found or disabled' });
    }
    if (!client.redirectUris.includes(query.redirect_uri)) {
      return res.status(400).json({ error: 'invalid_redirect_uri', error_description: 'redirect_uri not allowed' });
    }
    // Validar usuario real
    const userEmail = query.mock_user_id;
    if (!userEmail) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'User email (mock_user_id) is required for demo' });
    }
    const user = await this.usersService.findByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ error: 'user_not_found', error_description: 'User not found' });
    }
    const userId = user.id;
    // Generar código de autorización (en memoria, para demo)
    const code = randomBytes(16).toString('hex');
    // Guardar el code en memoria (en producción, usar DB o cache)
    (global as any).oauthCodes = (global as any).oauthCodes || {};
    (global as any).oauthCodes[code] = { clientId: client.clientId, userId, expires: Date.now() + 300000 };
    // Redirigir al redirect_uri con el code y state
    const redirectUrl = new URL(query.redirect_uri);
    redirectUrl.searchParams.set('code', code);
    if (query.state) redirectUrl.searchParams.set('state', query.state);
    return res.redirect(redirectUrl.toString());
  }

  // Paso 2: Intercambio de código por token
  @Post('token')
async token(@Body() body: OauthTokenDto, @Res() res: Response) {
  const client = await this.oauthClientRepo.findOne({
    where: { clientId: body.client_id, enabled: true },
  });

  if (!client || client.clientSecret !== body.client_secret) {
    return res.status(400).json({
      error: 'invalid_client',
      error_description: 'Invalid client credentials',
    });
  }

  if (!client.redirectUris.includes(body.redirect_uri)) {
    return res.status(400).json({
      error: 'invalid_redirect_uri',
      error_description: 'redirect_uri not allowed',
    });
  }

  const codes = (global as any).oauthCodes || {};
  const codeData = codes[body.code];

  if (!codeData || codeData.clientId !== client.clientId || codeData.expires < Date.now()) {
    return res.status(400).json({
      error: 'invalid_grant',
      error_description: 'Invalid or expired code',
    });
  }

  const payload = {
    sub: codeData.userId,
    client_id: client.clientId,
  };

  const access_token = this.jwtService.sign(payload);

  delete codes[body.code];

  return res.json({
    access_token,
    token_type: 'Bearer',
    expires_in: 3600,
  });
}

  // Paso 3: Obtener información del usuario
  @Get('userinfo')
async userinfo(@Req() req: Request, @Res() res: Response) {
  const auth = req.headers['authorization'];

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'invalid_token',
      error_description: 'Missing or invalid Authorization header',
    });
  }

  const token = auth.slice('Bearer '.length);

  let payload: any;

  try {
    payload = this.jwtService.verify(token);
  } catch (e) {
    return res.status(401).json({
      error: 'invalid_token',
      error_description: 'Invalid or expired token',
    });
  }

  const user = await this.usersService.findOne(payload.sub);

  if (!user) {
    return res.status(404).json({
      error: 'user_not_found',
    });
  }

  return res.json({
    sub: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    lineId: user.lineId,
    isSystemAdmin: user.isSystemAdmin,
  });
}
}
