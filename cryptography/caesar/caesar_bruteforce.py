ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def crack_caesar(cipher_text):
    # trying all the possible key values (same as the size of the alphabet)
    for key in range(len(ALPHABET)):
        plain_text = ""
        alphabet_length = len(ALPHABET)
        for c in cipher_text:
            index = ALPHABET.find(c)
            index = (index - key) % alphabet_length
            plain_text = plain_text + ALPHABET[index]
        print("With key %s, the result is: %s" % (key, plain_text))

if __name__ == "__main__":
    text = input("What is the encrypted message: ").upper()
    crack_caesar(text)