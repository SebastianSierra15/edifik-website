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
        ? "Ingrese el área total de la propiedad en metros cuadrados."
        : "Ingrese el área total del proyecto en metros cuadrados.",
    builtArea:
      projectTypeId === 2 || projectTypeId === 3
        ? "Ingrese el área construida de la propiedad en metros cuadrados, considerando únicamente las áreas cubiertas."
        : "Ingrese el área construida del proyecto en metros cuadrados, considerando únicamente las áreas cubiertas.",
    socioeconomicLevel:
      "Seleccione el nivel socioeconómico asignado a la propiedad según la clasificación oficial del sector.",
    yearBuilt:
      "Seleccione el año en que la propiedad fue construida o su estructura original terminada.",
    bedrooms:
      projectTypeId === 2 || projectTypeId === 3
        ? "Especifique cuántas habitaciones tiene la propiedad."
        : "Especifique cuántas habitaciones tendrá el proyecto.",
    bathrooms:
      projectTypeId === 2 || projectTypeId === 3
        ? "Indique la cantidad total de baños que tiene la propiedad."
        : "Indique la cantidad total de baños que estarán incluidos en el proyecto.",
    lobbies:
      projectTypeId === 2 || projectTypeId === 3
        ? "Ingrese el número de salas de estar (salones o lobbies) que tiene la propiedad."
        : "Ingrese el número de salas de estar (salones o lobbies) que tendrá el proyecto.",
    freeHeight:
      "Especifique la altura libre del proyecto en metros, considerando el espacio disponible entre el suelo y el techo.",
    width:
      "Indique el frente total del proyecto en metros. Este valor corresponde a la dimensión horizontal.",
    length:
      "Especifique el fondo total del proyecto en metros. Este valor corresponde a la dimensión vertical.",
    heavyParking:
      "Indique cuántos espacios de parqueo estarán disponibles para vehículos pesados.",
    towers:
      projectTypeId === 2 || projectTypeId === 3
        ? "Indique la torre en la que se encuentra la propiedad (si aplica)."
        : "Ingrese la cantidad de torres que tendrá el proyecto, si corresponde.",
    floorNumber:
      "Ingrese el número de piso donde se encuentra el apartamento. Por ejemplo, '3' para el tercer piso.",
    storageUnits:
      projectTypeId === 2 || projectTypeId === 3
        ? "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles para la propiedad."
        : "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles en el proyecto.",
    parkingSpots:
      "Especifique el número total de espacios de parqueo que estarán disponibles.",
  };
}
