import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isUUID } from 'class-validator';

export function IsOptionalUUID(version?: '3' | '4' | '5' | 'all', validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalUUID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Si el valor es null, undefined o string vacío, es válido
          if (value === null || value === undefined || value === '') {
            return true;
          }
          // Si tiene valor, debe ser un UUID válido
          return isUUID(value, version);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid UUID or null`;
        },
      },
    });
  };
}