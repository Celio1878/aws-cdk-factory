export function normalize_name(name: string) {
	return name.replace(new RegExp('-', 'gi'), '').replace(new RegExp('_', 'gi'), '');
}
