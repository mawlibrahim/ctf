section .text
	global _start

_start:
	movzx eax, byte [angkapertama]
	movzx ebx, byte [angkakedua]
	add eax, ebx
	mov [total], eax

	; --- Convert the binary sum to ASCII string ---
	; Assuming the sum will fit into a small two-digit number (0-99)
	mov edi, sum_buffer

	; Get the tens digit
	mov ecx, 10			; Divisor
	xor edx, edx			; Clear EDX for division (EDX:EDX / ECX)
	div ecx				; EAX = EAX / 10 (quotient), EDX = EAX % 10 (remainder)
					; After this: EAX = 1 (tens digit), EDX = 9 (units digit)

	add al, '0'			; Convert tens digit (in AL) to ASCII character ('1')
	mov [edi], al			; Store '1' in the buffer

	inc edi

	add dl, '0'			; Convert units digit (in DL) to ASCII character ('9')
	mov [edi], dl			; Store '9' in the buffer

	inc edi
	mov byte [edi], 0xa
	inc edi

	; --- Print the ASCII string ---
	mov edx, edi
	sub edx, sum_buffer
	mov ecx, sum_buffer
	mov ebx, 1
	mov eax, 4
	int 0x80

	; --- Exit the program ---
	mov eax, 1
	xor ebx, ebx
	int 0x80

section .data
	angkapertama db 9
	angkakedua db 10
	total dd 0

section .bss
	sum_buffer resb 3		; Reserve 3 bytes for "XY\n" (e.g., "25\n")
