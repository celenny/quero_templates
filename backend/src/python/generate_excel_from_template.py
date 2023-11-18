from pandas import DataFrame
from json import loads
from sys import argv, stdout

def main():
	json = argv[1].replace("\'", "\"")
	template_json = loads(json)
	template_fields = template_json["fields"]

	data = {}

	for field in template_fields:
		data[field] = []

	df = DataFrame(data)

	file_name = f'{template_json["name"]}.{template_json["extension"]}'
	match template_json["extension"]:
		case "csv":
			df.to_csv(file_name, index=False, sep=";")
		case _:
			df.to_excel(file_name, index=False, engine='openpyxl')

	return file_name

if __name__ == "__main__":
	stdout.write(main())