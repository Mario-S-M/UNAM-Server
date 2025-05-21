import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
  superUser = 'superUser',
  admin = 'admin',
  docente = 'docente',
  alumno= 'alumno',
  mortal = 'mortal'
}

registerEnumType(ValidRoles,{name:'ValidRoles'});
