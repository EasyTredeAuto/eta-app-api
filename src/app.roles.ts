import { RolesBuilder } from "nest-access-control";

export enum AppRoles {
    AUTHOR = 'AUTHOR',
    ADMIN = 'ADMIN'
}

export enum AppResources {
    USER = 'USER'
}

export const roles: RolesBuilder = new RolesBuilder()

roles
    // AUTHOR ROLES
    .grant(AppRoles.AUTHOR)
    .createOwn([AppResources.USER])
    .updateOwn([AppResources.USER])
    .deleteOwn([AppResources.USER])

    // ADMIN ROLES
    .grant(AppRoles.ADMIN)
    .extend(AppRoles.AUTHOR)
    .createAny([AppResources.USER])
    .updateAny([AppResources.USER])
    .deleteAny([AppResources.USER])