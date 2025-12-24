export function getFeatureVisibility(
  propertyTypeId: number | undefined
): Record<string, boolean> {
  return {
    socioeconomicLevel: propertyTypeId === 1001 || propertyTypeId === 1002,
    yearBuilt: propertyTypeId === 1001 || propertyTypeId === 1002,
    bedrooms: propertyTypeId === 1001 || propertyTypeId === 1002,
    storageUnits: propertyTypeId === 1001 || propertyTypeId === 1002,
    balcony: propertyTypeId === 1001 || propertyTypeId === 1002,
    laundryArea: propertyTypeId === 1001 || propertyTypeId === 1002,
    customizationOptions: propertyTypeId === 1001 || propertyTypeId === 1002,
    terrace: propertyTypeId === 1001,
    garden: propertyTypeId === 1001,
    bathrooms:
      propertyTypeId === 1001 ||
      propertyTypeId === 1002 ||
      propertyTypeId === 1004,
    lobbies:
      propertyTypeId === 1001 ||
      propertyTypeId === 1002 ||
      propertyTypeId === 1004,
    elevator: propertyTypeId === 1001 || propertyTypeId === 1002,
    towers: propertyTypeId === 1002,
    floorNumber: propertyTypeId === 1002,
    freeHeight:
      propertyTypeId === 1004 ||
      propertyTypeId === 1003 ||
      propertyTypeId === 1005,
    width:
      propertyTypeId === 1005 ||
      propertyTypeId === 1006 ||
      propertyTypeId === 1007,
    length:
      propertyTypeId === 1005 ||
      propertyTypeId === 1006 ||
      propertyTypeId === 1007,
    heavyParking: propertyTypeId === 1005,
  };
}

export function getFeaturesTooltipTexts(projectTypeId: number | undefined) {
  return {
    totalArea:
      projectTypeId === 2 || projectTypeId === 3
        ? "Ingrese el Ç­rea total de la propiedad en metros cuadrados."
        : "Ingrese el Ç­rea total del proyecto en metros cuadrados.",
    builtArea:
      projectTypeId === 2 || projectTypeId === 3
        ? "Ingrese el Ç­rea construida de la propiedad en metros cuadrados, considerando Ç§nicamente las Ç­reas cubiertas."
        : "Ingrese el Ç­rea construida del proyecto en metros cuadrados, considerando Ç§nicamente las Ç­reas cubiertas.",
    socioeconomicLevel:
      "Seleccione el nivel socioeconÇümico asignado a la propiedad segÇ§n la clasificaciÇün oficial del sector.",
    yearBuilt:
      "Seleccione el aÇño en que la propiedad fue construida o su estructura original terminada.",
    bedrooms:
      projectTypeId === 2 || projectTypeId === 3
        ? "Especifique cuÇ­ntas habitaciones tiene la propiedad."
        : "Especifique cuÇ­ntas habitaciones tendrÇ­ el proyecto.",
    bathrooms:
      projectTypeId === 2 || projectTypeId === 3
        ? "Indique la cantidad total de baÇños que tiene la propiedad."
        : "Indique la cantidad total de baÇños que estarÇ­n incluidos en el proyecto.",
    lobbies:
      projectTypeId === 2 || projectTypeId === 3
        ? "Ingrese el nÇ§mero de salas de estar (salones o lobbies) que tiene la propiedad."
        : "Ingrese el nÇ§mero de salas de estar (salones o lobbies) que tendrÇ­ el proyecto.",
    freeHeight:
      "Especifique la altura libre del proyecto en metros, considerando el espacio disponible entre el suelo y el techo.",
    width:
      "Indique el frente total del proyecto en metros. Este valor corresponde a la dimensiÇün horizontal.",
    length:
      "Especifique el fondo total del proyecto en metros. Este valor corresponde a la dimensiÇün vertical.",
    heavyParking:
      "Indique cuÇ­ntos espacios de parqueo estarÇ­n disponibles para vehÇðculos pesados.",
    towers:
      projectTypeId === 2 || projectTypeId === 3
        ? "Indique la torre en la que se encuentra la propiedad (si aplica)."
        : "Ingrese la cantidad de torres que tendrÇ­ el proyecto, si corresponde.",
    floorNumber:
      "Ingrese el nÇ§mero de piso donde se encuentra el apartamento. Por ejemplo, '3' para el tercer piso.",
    storageUnits:
      projectTypeId === 2 || projectTypeId === 3
        ? "Especifique el nÇ§mero total de depÇüsitos (bodegas o cuartos de almacenamiento) disponibles para la propiedad."
        : "Especifique el nÇ§mero total de depÇüsitos (bodegas o cuartos de almacenamiento) disponibles en el proyecto.",
    parkingSpots:
      "Especifique el nÇ§mero total de espacios de parqueo que estarÇ­n disponibles.",
  };
}
