import os
def bytes_to_human_readable(num, suffix='B'):
    for unit in ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z']:
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"

def get_files_from_dir(path):
    file_list=[]
    for file in os.listdir(path):
        if os.path.isfile(os.path.join(path, file)):
            
            file_list.append(file)
    return file_list