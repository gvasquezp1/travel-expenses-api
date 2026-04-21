import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemModule } from './entities/system-module.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';

interface PermissionSeedData {
  name: string;
  code: string;
  description?: string;
}

interface ModuleSeedData {
  name: string;
  description: string;
  permissions: PermissionSeedData[];
}

const SEED_DATA: ModuleSeedData[] = [
  {
    name: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    permissions: [
      { name: 'Entrar al módulo', code: 'usuarios.access' },
      { name: 'Crear usuario', code: 'usuarios.create' },
      { name: 'Editar usuario', code: 'usuarios.update' },
      { name: 'Cambiar clave', code: 'usuarios.change_password' },
      { name: 'Eliminar usuario', code: 'usuarios.delete' },
    ],
  },
  {
    name: 'Permisos',
    description: 'Gestión de permisos y módulos del sistema',
    permissions: [
      { name: 'Entrar al módulo', code: 'permisos.access' },
    ],
  },
  {
    name: 'Usuarios - Roles',
    description: 'Gestión de roles de usuarios',
    permissions: [
      { name: 'Entrar al módulo', code: 'usuarios_roles.access' },
      { name: 'Crear role', code: 'usuarios_roles.create' },
      { name: 'Editar role', code: 'usuarios_roles.update' },
      { name: 'Eliminar role', code: 'usuarios_roles.delete' },
    ],
  },
  {
    name: 'Lineas',
    description: 'Gestión de líneas de negocio',
    permissions: [
      { name: 'Entrar al módulo', code: 'lineas.access' },
      { name: 'Crear línea', code: 'lineas.create' },
      { name: 'Editar línea', code: 'lineas.update' },
      { name: 'Eliminar línea', code: 'lineas.delete' },
    ],
  },
  {
    name: 'Centros de costos',
    description: 'Gestión de centros de costos',
    permissions: [
      { name: 'Entrar al módulo', code: 'centros_costos.access' },
      { name: 'Crear centro de costo', code: 'centros_costos.create' },
      { name: 'Editar centro de costo', code: 'centros_costos.update' },
      { name: 'Eliminar centro de costo', code: 'centros_costos.delete' },
    ],
  },
  {
    name: 'Viaticos',
    description: 'Gestión de viáticos',
    permissions: [
      { name: 'Entrar al módulo', code: 'viaticos.access' },
      { name: 'Crear viático', code: 'viaticos.create' },
      { name: 'Editar viático', code: 'viaticos.update' },
      { name: 'Eliminar viático', code: 'viaticos.delete' },
    ],
  },
  {
    name: 'Topes Rol/Categoria',
    description: 'Gestión de topes por rol y categoría',
    permissions: [
      { name: 'Entrar al módulo', code: 'topes_rol.access' },
      { name: 'Crear tope', code: 'topes_rol.create' },
      { name: 'Editar tope', code: 'topes_rol.update' },
      { name: 'Eliminar tope', code: 'topes_rol.delete' },
    ],
  },
  {
    name: 'Topes Solicitudes/Linea',
    description: 'Gestión de topes de solicitudes por línea',
    permissions: [
      { name: 'Entrar al módulo', code: 'topes_solicitudes.access' },
      // { name: 'Crear tope', code: 'topes_solicitudes.create' },
      // { name: 'Editar tope', code: 'topes_solicitudes.update' },
      // { name: 'Eliminar tope', code: 'topes_solicitudes.delete' },
    ],
  },
  {
    name: 'Solicitud de viaticos',
    description: 'Gestión de solicitudes de viáticos',
    permissions: [
      { name: 'Entrar al módulo', code: 'solicitud_viaticos.access' },
      { name: 'Mostrar todas las solicitudes', code: 'solicitud_viaticos.view_all' },
      { name: 'Autorizar solicitudes en tesorería', code: 'solicitud_viaticos.tesoreria_approve' },
      { name: 'Autorizar solicitudes en contabilidad', code: 'solicitud_viaticos.contabilidad_approve' },
      { name: 'Ver gastos asociados a la solicitud', code: 'solicitud_viaticos.view_expenses_details' },
      { name: 'Crear solicitud', code: 'solicitud_viaticos.create' },
      { name: 'Editar solicitud', code: 'solicitud_viaticos.update' },
      { name: 'Eliminar solicitud', code: 'solicitud_viaticos.delete' },
      { name: 'Aprobar solicitud', code: 'solicitud_viaticos.approve' },
      { name: 'Rechazar solicitud', code: 'solicitud_viaticos.reject' },
    ],
  },
  // {
  //   name: 'Legalización',
  //   description: 'Gestión de legalización de viáticos',
  //   permissions: [
  //     { name: 'Entrar al módulo', code: 'legalizacion.access' },
  //     { name: 'Crear legalización', code: 'legalizacion.create' },
  //     { name: 'Editar legalización', code: 'legalizacion.update' },
  //     { name: 'Eliminar legalización', code: 'legalizacion.delete' },
  //     { name: 'Aprobar legalización', code: 'legalizacion.approve' },
  //     { name: 'Rechazar legalización', code: 'legalizacion.reject' },
  //   ],
  // },
];

@Injectable()
export class PermissionSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PermissionSeedService.name);

  constructor(
    @InjectRepository(SystemModule)
    private readonly moduleRepo: Repository<SystemModule>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    // Verificar si ya existen role_permissions
    const existingRolePermissionsCount = await this.rolePermissionRepo.count();
    
    if (existingRolePermissionsCount > 0) {
      this.logger.log(`Ya existen ${existingRolePermissionsCount} role_permissions. Saltando seed de permisos.`);
      return {
        message: 'Seed omitido - ya existen role_permissions',
        rolePermissionsExistentes: existingRolePermissionsCount,
      };
    }

    let modulesCreated = 0;
    let permissionsCreated = 0;

    for (const moduleDef of SEED_DATA) {
      let module = await this.moduleRepo.findOne({
        where: { name: moduleDef.name },
      });

      if (!module) {
        module = this.moduleRepo.create({
          name: moduleDef.name,
          description: moduleDef.description,
        });
        await this.moduleRepo.save(module);
        modulesCreated++;
      }

      for (const permDef of moduleDef.permissions) {
        let permission = await this.permissionRepo.findOne({
          where: { code: permDef.code },
        });

        if (!permission) {
          permission = this.permissionRepo.create({
            name: permDef.name,
            code: permDef.code,
            description: permDef.description,
            moduleId: module.id,
          });
          await this.permissionRepo.save(permission);
          permissionsCreated++;
        }
      }
    }

    this.logger.log(`Seed completado. Módulos creados: ${modulesCreated}, Permisos creados: ${permissionsCreated}`);
    return {
      message: 'Seed completado',
      modulesCreated,
      permissionsCreated,
    };
  }
} 
