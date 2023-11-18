from os import path, stat
from json import dumps
from datetime import datetime
from sys import argv, stdout

if __name__ == "__main__":
	file = stat(argv[1])
    
	info_file = {
        'name': path.basename(argv[1]),
        'size': f'{file.st_size / 1000:.1f}kb',
        'date': f'{datetime.fromtimestamp(file.st_ctime)}'
	}

	stdout.write(dumps(info_file))
