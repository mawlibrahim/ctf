import time
import base64
import hashlib
import sys
import secrets


class Block:
    def __init__(self, index, previous_hash, timestamp, encoded_transactions, nonce):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.encoded_transactions = encoded_transactions
        self.nonce = nonce

    def calculate_hash(self):
        block_string = f"{self.index}{self.previous_hash}{self.timestamp}{self.encoded_transactions}{self.nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()


def proof_of_work(previous_block, encoded_transactions):
    index = previous_block.index + 1
    timestamp = int(time.time())
    nonce = 0

    block = Block(index, previous_block.calculate_hash(),
                  timestamp, encoded_transactions, nonce)

    while not is_valid_proof(block):
        nonce += 1
        block.nonce = nonce

    return block


def is_valid_proof(block):
    guess_hash = block.calculate_hash()
    return guess_hash[:2] == "00"


def decode_transactions(encoded_transactions):
    return base64.b64decode(encoded_transactions).decode('utf-8')


def get_all_blocks(blockchain):
    return blockchain


def blockchain_to_string(blockchain):
    block_strings = [f"{block.calculate_hash()}" for block in blockchain]
    return '-'.join(block_strings)


def encrypt(plaintext, inner_txt, key):
    midpoint = len(plaintext) // 2

    first_part = plaintext[:midpoint]
    second_part = plaintext[midpoint:]
    modified_plaintext = first_part + inner_txt + second_part
    block_size = 16
    plaintext = pad(modified_plaintext, block_size)
    key_hash = hashlib.sha256(key).digest()

    ciphertext = b''

    for i in range(0, len(plaintext), block_size):
        block = plaintext[i:i + block_size]
        cipher_block = xor_bytes(block, key_hash)
        ciphertext += cipher_block

    return ciphertext


def pad(data, block_size):
    padding_length = block_size - len(data) % block_size
    padding = bytes([padding_length] * padding_length)
    return data.encode() + padding


def xor_bytes(a, b):
    return bytes(x ^ y for x, y in zip(a, b))


def generate_random_string(length):
    return secrets.token_hex(length // 2)


random_string = generate_random_string(64)

def decrypt():
    key = b'\xe8\xa6\xde\xcf\\\xbe\xf8\xd8\x81\xc4y\x19\xa5\x92E\x0e\x1f\xa6\xb4\n\xcbY\x1dI\x891\x0e\x8c\xcd\x8f\r\x80'
    cyphertext = b'x\xa9\xcaR^\'J\x86\xdd\xb7\x00]\x07\xd3\xb4ip\xf8\x9b\x08_p\x1a\xd7\xdc\xb2W\x00\x01\x86\xb4<,\xaf\xcaRW"K\xd3\xda\xb5\x07TZ\x86\xe4;\x7f\xaf\xcfWTuN\x83\xdb\xe2\x03\x04T\xd7\xe3oe\xad\xca\x05V"J\xd3\xd2\xe6VS\x06\x8a\xefi*\xa8\x9f\x01\x04"O\x8b\xd3\xb4TRR\x8a\xe2o\x7f\xf9\xc9\x05\x07u\x18\xd3\xd9\xe1SVV\x82\xe2k}\xa8\xc8P\x00sM\x87\x8b\xb2QU\x00\x83\xe0h)\xb0\xca\x01\x02\'K\x80\x8e\xb4UP\x00\x81\xe0i|\xfe\x9b\x04\x02sL\xd4\xdc\xe2[WZ\xd1\xe0<)\xa5\x8aX\x05.?\xe6\xac\xfc\x00\t\x0c\xd1\xbd\x01{\xce\xa8Y0(.\xd0\xbe\xb6\x13\x06;\xed\x8e\x0b"\xd0\xcaCRx\x1f\xfa\xb5\xf6!\x1f\x0e\xf8\x8c$\n\xd6\xa5R^r\x19\xd3\x8f\xe2Q\x18V\x8a\xb2nx\xa8\xcd\t\x02vD\x84\xde\xb4\x04\x06R\xd0\xe3kp\xfb\x99\x04Wy\x18\xd1\xdb\xe5Z]N\x82\xe6i)\xaa\x98\x01^"H\x84\xdf\xe3\x04PS\x8a\xef8q\xac\xcdRR"J\x85\xdc\xe4R\x07Z\x85\xb0=+\xa4\xc2SVs\x1e\x80\xd2\xb2P\x06\x06\x80\xeff~\xaa\xc3\x06\x00$I\x83\x8b\xe5P\x06S\x9f\xe6np\xa8\xcc\x05Q"\x1f\x87\xdf\xb3\x01U\x01\x83\xe5l~\xa5\xca\x03S%D\xd7\xdc\xb2W\x06\x01\xd3\xe0j+\xa5\xcd\x02\x00 J\x84\xd2\xb7[VU\xd3\xb0h.\xaf\xcc\x02Q#D\xd7\x89\xe3R\x00\x05\x80\xd4\\'
    

def main(token):
    key = bytes.fromhex(random_string)

    print("Key:", key)

    genesis_block = Block(0, "0", int(time.time()), "EncodedGenesisBlock", 0)
    blockchain = [genesis_block]

    for i in range(1, 5):
        encoded_transactions = base64.b64encode(
            f"Transaction_{i}".encode()).decode('utf-8')
        new_block = proof_of_work(blockchain[-1], encoded_transactions)
        blockchain.append(new_block)

    all_blocks = get_all_blocks(blockchain)

    blockchain_string = blockchain_to_string(all_blocks)
    encrypted_blockchain = encrypt(blockchain_string, token, key)

    print("Encrypted Blockchain:", encrypted_blockchain)


if __name__ == "__main__":
    text = sys.argv[1]
    main(text)
