
ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'
KEY = 3

def caesar_encrypt(plain_text):
    cipher_text = ""
    plain_text = plain_text.upper()
    # consider all the letters in the plain_text
    for c in plain_text:
        # find the numerical representation (index) associated with
        # that character in the alphabet
        index = ALPHABET.find(c)
        index = (index + KEY) % len(ALPHABET)
        cipher_text = cipher_text + ALPHABET[index]
    return cipher_text

def caesar_decrypt(cipher_text):
    plain_text = ""
    for c in cipher_text:
        index = ALPHABET.find(c)
        index = (index - KEY) % len(ALPHABET)
        plain_text = plain_text + ALPHABET[index]
    return plain_text

if __name__ == "__main__":
    text = caesar_encrypt(input("Input text: "))
    print(text)
    text = caesar_decrypt(text)
    print(text)