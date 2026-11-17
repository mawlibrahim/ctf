section .text
	global _start

_start:
	movzx eax, byte [angkapertama]	; EAX = 30 (binary)
	movzx ebx, byte [angkakedua]
	add eax, ebx			; EBX is added into EAX
	mov [total], eax		; EAX is added into variable total
	mov edx, 4
	mov ecx, total
	mov ebx, 1
	mov eax, 4
	int 0x80

	mov eax, 1
	xor ebx, ebx			; Clear EBX for successful exit code
	int 0x80

section .data
	angkapertama db 30
	angkakedua db 35
	total dd 0			; Define a DOUBLEWORD (4 bytes) to store the sum
