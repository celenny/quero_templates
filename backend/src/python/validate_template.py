from pandas import read_csv, read_excel
from os import path
from json import loads, dumps
from sys import argv, stdout

def main():
	json = argv[2].replace("\'", "\"")
	template_json = loads(json)
	extension = path.basename(argv[1]).split(".")[1]

	if template_json["extension"] != extension:
		return { 'success': False, 'msg': 'Extensão errada' }
	
	match extension:
		case "csv":
			sheet = read_csv(argv[1])
		case _:
			sheet = read_excel(argv[1])

	sheet_header = sheet.columns.to_list()
	data_types = sheet.dtypes

	template_fields = template_json["fields"]

	if len(sheet_header) != len(template_fields):
		return { 'success': False, 'msg': 'Quantidade de campos não coincide' }

	count = 0
	for field in template_fields:
		if sheet_header[count] != field:
			return { 'success': False, 'msg': 'Nome de um dos campos não coincide' }
		
		if template_fields[field] != data_types.iloc[count]:
			return { 'success': False, 'msg': 'Tipo da coluna não coincide' }

		count += 1
	return { 'success': True }

if __name__ == "__main__":
	stdout.write(dumps(main()))