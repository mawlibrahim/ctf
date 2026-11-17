section .text
	global _start

_start:
	mov edx, panjang
	mov ecx, pesan
	mov ebx, 1
	mov eax, 4
	int 0x80

	mov eax, 1
	int 0x80

section .data
	pesan db 'Pesan terlarang.', 0xa
	panjang equ $ - pesan
