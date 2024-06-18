type FilterType =
  | "fuzzy"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "equals"
  | "notEquals"
  | "between"
  | "betweenInclusive"
  | "greaterThan"
  | "greaterThanOrEqualTo"
  | "lessThan"
  | "lessThanOrEqualTo"
  | "empty"
  | "notEmpty";

type FilterVariant =
  | "text"
  | "autocomplete"
  | "select"
  | "number"
  | "multi-select"
  | "date"
  | "datetime"
  | "date-range"
  | "datetime-range"
  | "time"
  | "time-range"
  | "range"
  | "range-slider"
  | "checkbox";

type Filter = {
  id: string;
  value: any;
  filtervariant: FilterVariant;
  type: FilterType;
};

type Where = {
  [key: string]: any;
};

const isValidNumericValue = (value: any): boolean =>
  value !== undefined && value !== null && value !== "" && !isNaN(value);

const isValidStringValue = (value: any): boolean =>
  value !== undefined && value !== null && value !== "";

const applyFilter = (filter: Filter, where: Where): void => {
  const { id, value, filtervariant, type } = filter;

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.every((v) => v === null || v === ""))
  )
    return;

  const applyTextFilter = (nestedFilter: Where, key: string) => {
    switch (type) {
      case "fuzzy":
      case "contains":
        if (isValidStringValue(value))
          nestedFilter[key] = { contains: value, mode: "insensitive" };
        break;
      case "startsWith":
        if (isValidStringValue(value))
          nestedFilter[key] = { startsWith: value, mode: "insensitive" };
        break;
      case "endsWith":
        if (isValidStringValue(value))
          nestedFilter[key] = { endsWith: value, mode: "insensitive" };
        break;
      case "equals":
        if (isValidStringValue(value))
          nestedFilter[key] = { equals: value, mode: "insensitive" };
        break;
      case "notEquals":
        if (isValidStringValue(value))
          nestedFilter[key] = { not: value, mode: "insensitive" };
        break;
      case "between":
        const [lower, upper] = value;
        if (isValidStringValue(lower) && isValidStringValue(upper)) {
          nestedFilter[key] = {
            gt: lower,
            lt: upper,
          };
        }
        break;
      case "betweenInclusive":
        const [lowerInclusive, upperInclusive] = value;
        if (
          isValidStringValue(lowerInclusive) &&
          isValidStringValue(upperInclusive)
        ) {
          nestedFilter[key] = {
            gte: lowerInclusive,
            lte: upperInclusive,
          };
        }
        break;
      case "greaterThan":
        if (isValidStringValue(value)) nestedFilter[key] = { gt: value };
        break;
      case "greaterThanOrEqualTo":
        if (isValidStringValue(value)) nestedFilter[key] = { gte: value };
        break;
      case "lessThan":
        if (isValidStringValue(value)) nestedFilter[key] = { lt: value };
        break;
      case "lessThanOrEqualTo":
        if (isValidStringValue(value)) nestedFilter[key] = { lte: value };
        break;
      case "empty":
        nestedFilter[key] = { equals: null };
        break;
      case "notEmpty":
        nestedFilter[key] = { not: null };
        break;
      default:
        break;
    }
  };

  const applyMultiSelectFilter = (nestedFilter: Where, key: string) => {
    switch (type) {
      case "equals":
        nestedFilter[key] = { in: value };
        break;
      case "notEquals":
        nestedFilter[key] = { notIn: value };
        break;
      default:
        break;
    }
  };

  const applyNumericFilter = (nestedFilter: Where, key: string) => {
    const numericValue = parseFloat(value);
    switch (type) {
      case "equals":
        if (isValidNumericValue(numericValue))
          nestedFilter[key] = { equals: numericValue };
        break;
      case "notEquals":
        if (isValidNumericValue(numericValue))
          nestedFilter[key] = { not: numericValue };
        break;
      case "between":
        const [lower, upper] = value;
        if (isValidNumericValue(lower) && isValidNumericValue(upper)) {
          nestedFilter[key] = { gt: parseFloat(lower), lt: parseFloat(upper) };
        }
        break;
      case "betweenInclusive":
        const [lowerInclusive, upperInclusive] = value;
        if (
          isValidNumericValue(lowerInclusive) &&
          isValidNumericValue(upperInclusive)
        ) {
          nestedFilter[key] = {
            gte: parseFloat(lowerInclusive),
            lte: parseFloat(upperInclusive),
          };
        }
        break;
      case "greaterThan":
        if (isValidNumericValue(numericValue))
          nestedFilter[key] = { gt: numericValue };
        break;
      case "greaterThanOrEqualTo":
        if (isValidNumericValue(numericValue))
          nestedFilter[key] = { gte: numericValue };
        break;
      case "lessThan":
        if (isValidNumericValue(numericValue))
          nestedFilter[key] = { lt: numericValue };
        break;
      case "lessThanOrEqualTo":
        if (isValidNumericValue(numericValue))
          nestedFilter[key] = { lte: numericValue };
        break;
      default:
        break;
    }
  };

  const applyDateFilter = (nestedFilter: Where, key: string) => {
    if (Array.isArray(value)) {
      switch (type) {
        case "between":
          const [startDate, endDate] = value.map((v) => new Date(v));
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            nestedFilter[key] = { gte: startDate, lte: endDate };
          }
          break;
        case "betweenInclusive":
          const [startDateInclusive, endDateInclusive] = value.map(
            (v) => new Date(v)
          );
          if (
            !isNaN(startDateInclusive.getTime()) &&
            !isNaN(endDateInclusive.getTime())
          ) {
            nestedFilter[key] = {
              gte: startDateInclusive,
              lte: endDateInclusive,
            };
          }
          break;
      }
    } else {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        switch (type) {
          case "equals":
            nestedFilter[key] = { equals: dateValue };
            break;
          case "notEquals":
            nestedFilter[key] = { not: dateValue };
            break;
          case "lessThan":
            nestedFilter[key] = { lt: dateValue };
            break;
          case "lessThanOrEqualTo":
            nestedFilter[key] = { lte: dateValue };
            break;
          case "greaterThan":
            nestedFilter[key] = { gt: dateValue };
            break;
          case "greaterThanOrEqualTo":
            nestedFilter[key] = { gte: dateValue };
            break;
          default:
            break;
        }
      }
    }
  };

  const applyTimeFilter = (nestedFilter: Where, key: string) => {
    const isValidStringValue = (str: any): boolean =>
      typeof str === "string" && str.trim() !== "";

    switch (type) {
      case "equals":
        if (isValidStringValue(value)) {
          const dateObject = new Date(value);
          if (!isNaN(dateObject.getTime())) {
            nestedFilter[key] = { equals: dateObject.toLocaleTimeString() };
          }
        }
        break;
      case "notEquals":
        if (isValidStringValue(value)) {
          const dateObject = new Date(value);
          if (!isNaN(dateObject.getTime())) {
            nestedFilter[key] = { not: dateObject.toLocaleTimeString() };
          }
        }
        break;
      case "greaterThan":
        if (isValidStringValue(value)) {
          const dateObject = new Date(value);
          if (!isNaN(dateObject.getTime())) {
            nestedFilter[key] = { gt: dateObject.toLocaleTimeString() };
          }
        }
        break;
      case "greaterThanOrEqualTo":
        if (isValidStringValue(value)) {
          const dateObject = new Date(value);
          if (!isNaN(dateObject.getTime())) {
            nestedFilter[key] = { gte: dateObject.toLocaleTimeString() };
          }
        }
        break;
      case "lessThan":
        if (isValidStringValue(value)) {
          const dateObject = new Date(value);
          if (!isNaN(dateObject.getTime())) {
            nestedFilter[key] = { lt: dateObject.toLocaleTimeString() };
          }
        }
        break;
      case "lessThanOrEqualTo":
        if (isValidStringValue(value)) {
          const dateObject = new Date(value);
          if (!isNaN(dateObject.getTime())) {
            nestedFilter[key] = { lte: dateObject.toLocaleTimeString() };
          }
        }
        break;
      case "between":
        if (Array.isArray(value) && value.length === 2) {
          const [startTime, endTime] = value.map((dateTimeString) => {
            const dateObject = new Date(dateTimeString);
            return isValidStringValue(dateTimeString) &&
              !isNaN(dateObject.getTime())
              ? dateObject.toLocaleTimeString()
              : null;
          });

          if (startTime && endTime) {
            nestedFilter[key] = { gt: startTime, lt: endTime };
          }
        }
        break;
      case "betweenInclusive":
        if (Array.isArray(value) && value.length === 2) {
          const [startTime, endTime] = value.map((dateTimeString) => {
            const dateObject = new Date(dateTimeString);
            return isValidStringValue(dateTimeString) &&
              !isNaN(dateObject.getTime())
              ? dateObject.toLocaleTimeString()
              : null;
          });

          if (startTime && endTime) {
            nestedFilter[key] = { gte: startTime, lte: endTime };
          }
        }
        break;
      default:
        break;
    }
  };

  const applyRangeFilter = (nestedFilter: Where, key: string) => {
    switch (type) {
      case "between":
        if (Array.isArray(value) && value.length === 2) {
          const [min, max] = value;
          if (isValidNumericValue(min) && isValidNumericValue(max)) {
            nestedFilter[key] = { gt: parseFloat(min), lt: parseFloat(max) };
          }
        }
        break;
      case "betweenInclusive":
        if (Array.isArray(value) && value.length === 2) {
          const [min, max] = value;
          if (isValidNumericValue(min) && isValidNumericValue(max)) {
            nestedFilter[key] = { gte: parseFloat(min), lte: parseFloat(max) };
          }
        }
        break;
      default:
        break;
    }
  };

  const applyBooleanFilter = (nestedFilter: Where, key: string) => {
    let booleanValue;
    if (value === "false") {
      booleanValue = false;
    } else {
      booleanValue = true;
    }
    if (typeof booleanValue === "boolean") {
      nestedFilter[key] = { equals: booleanValue };
    }
  };

  const applyFilterByVariant = (nestedFilter: Where, key: string) => {
    switch (filtervariant) {
      case "text":
      case "autocomplete":
      case "select":
        applyTextFilter(nestedFilter, key);
        break;
      case "number":
        applyNumericFilter(nestedFilter, key);
        break;
      case "multi-select":
        applyMultiSelectFilter(nestedFilter, key);
        break;
      case "date":
      case "datetime":
      case "date-range":
      case "datetime-range":
        applyDateFilter(nestedFilter, key);
        break;
      case "time":
      case "time-range":
        applyTimeFilter(nestedFilter, key);
        break;
      case "range":
      case "range-slider":
        applyRangeFilter(nestedFilter, key);
        break;
      case "checkbox":
        applyBooleanFilter(nestedFilter, key);
        break;
      default:
        break;
    }
  };

  const match = id.match(/^([a-z]+)_([a-z]+)$/);
  if (match) {
    const parent = match[1];
    const nestedProperty = match[2];
    if (!where[parent]) {
      where[parent] = {};
    }
    applyFilterByVariant(where[parent], nestedProperty);
  } else {
    applyFilterByVariant(where, id);
  }
};

export { applyFilter };
