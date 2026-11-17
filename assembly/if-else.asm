section .text
	global _start

_start:
	movzx eax, byte [n1]
	movzx ebx, byte [n2]
	
	; Comparison
	cmp eax, ebx
	jne skip

	mov eax, 4
	mov ebx, 1
	mov ecx, pesan
	mov edx, pjg
	int 0x80

	mov eax, 1
	xor ebx, ebx
	int 0x80

skip:
	mov eax, 1
	int 0x80

section .data
	n1 db 10
	n2 db 10
	pesan db 'Setara', 0Ah
	pjg equ $-pesan
