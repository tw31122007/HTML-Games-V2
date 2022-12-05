/* virtual file emulation system with folder support */
export class VirtualFileSystem {
	constructor() {
		this.files = [];
		this.rootPath = "";
	}
	setRootPath(path) {
		this.rootPath = path;
	}
	addFile(file) {
		this.files.push(file);
	}
	/* internal method used to find the index of a file name, runs in O(n) time */
	fileIndex(fileName) {
		/* loop over all files until the required file is found */
		for (let i = 0; i < this.files.length; i++) {
			if (fileName === this.files[i].name) {
				/* return the files index */
				return i;
			}
		}
		/* otherwise if the file doesn't exist, return null */
		return null;
	}
	deleteFile(fileName) {
		let fileIndex = this.fileIndex(fileName);
		/* check if file does exist (null check) */
		if (fileIndex !== null) {
			this.files.splice(fileIndex, 1);
		}
	}
	/* given an old name, renamed to a new name*/
	renameFile(fileName, newFileName) {
		let fileIndex = this.fileIndex(fileName);
		/* check if file does exist (null check) */
		if (fileIndex !== null) {
			this.files[fileIndex].name = newFileName;
		}	
	}
	getFile(fileName) {
		let fileIndex = this.fileIndex(fileName);
		/* check if file does exist (null check) */
		if (fileIndex !== null) {
			return this.files[fileIndex];
		}
		return null;
	}
	/* 
	 *	should be a standardised path string, such as
	 *	files/src/images/image.png
	 *	./files/src/images.png
	 */
	get(pathString) {
		if (this.rootPath) {
			pathString = pathString.replace(this.rootPath + "/", "");
		}
		/* split the path by /'s, this shows how the directory should be traversed */
		let split = pathString.split("/");
		/* if the split path conains a ./ then remove it */
		if (split[0] == ".") {
			split.shift();
		}
		let currentIndex = 0;
		/* current directory is root node, which is file system */
		let currentDirectory = this;
		while (currentIndex < split.length) {
			/* get the required file in the current directory */
			let file = currentDirectory.getFile(split[currentIndex]);
			/* check if file exists */
			if (file) {
				/* if the type is a folder, set the currentDirectory to the new node */
				if (file.type === "folder") {
					currentDirectory = file;
					/* if the folder is expected to be the end point, then return the folder */
					if (currentIndex === split.length - 1) {
						return file;
					}
					currentIndex++;
				} else {
					/* if the type is a file, then check if it is expected to be the final leaf node */
					if (currentIndex === split.length - 1) {
						/* if it is return the file */
						return file;
					} else {
						/* return ull if it is not the final leaf node */
						return null;
					}
				}
			} else {
				/* return null if the file could not be found */
				return null;
			}
		}
	}
	/* since JSON removes prototype methods from objects, a method is require to hydrate and re-add the methods */
	static hydrate(object) {
		/* create the new file system */
		let fileSystem = new VirtualFileSystem();
		/* loop over all files and add to new file system*/
		for (let i = 0; i < object.files.length; i++) {
			if (object.files[i].type !== "folder") {
				fileSystem.addFile(new VirtualFile(object.files[i].name, object.files[i].data, object.files[i].type));
			}
		}
		return fileSystem;
	}
}

export class VirtualFile {
	constructor(name, data, type) {
		this.name = name;
		this.data = data;
		this.type = type;
	}
}

/* a folder is like a miniature virtual file system */
export class VirtualFolder extends VirtualFileSystem {
	constructor(name) {
		super();
		this.name = name;
		this.type = "folder";
	}
}


let fileSystem = new VirtualFileSystem();
console.log(fileSystem);