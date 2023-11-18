export function convertFormToJson(data: FormData) {
  const form: Record<string, any> = {}
  const columns: Record<string, string> = {};

  for (const [key, value] of data.entries()) {
    if (key.startsWith('columnName')) {
      // Extract column names and associate with the corresponding column type
      const columnNumber = key.replace('columnName', '');
      const columnName = value.toString();
      const columnTypeKey = `columnType${columnNumber}`;
      const columnType = data.get(columnTypeKey);
      if (columnType !== null) {
        columns[columnName] = columnType.toString();
      }
    } else if (!key.startsWith('columnType')) {
      form[key] = value;
    }
  }

  if (Object.keys(columns).length !== 0) {
    form["fields"] = columns
  }
  
  return form;
}