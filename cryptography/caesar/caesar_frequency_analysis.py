import matplotlib.pylab as plt

LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def frequency_analysis(text):
    text = text.upper()

    # make a key-value pair of letter and its frequency
    letter_frequencies = {}
    for letter in LETTERS:
        letter_frequencies[letter] = 0
    for letter in text:
        if letter in LETTERS:
            letter_frequencies[letter] += 1
    return letter_frequencies


def plot_distribution(letter_frequencies):
    plt.bar(letter_frequencies.keys(), letter_frequencies.values())
    plt.show()

if __name__ == "__main__":
    text = "J MPWF ZPV"
    frequency = frequency_analysis(text)
    plot_distribution(frequency)