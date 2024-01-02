const removeAccents = (text) => {
  const sustitutions = {
    àáâãäå: "a",
    ÀÁÂÃÄÅ: "A",
    èéêë: "e",
    ÈÉÊË: "E",
    ìíîï: "i",
    ÌÍÎÏ: "I",
    òóôõö: "o",
    ÒÓÔÕÖ: "O",
    ùúûü: "u",
    ÙÚÛÜ: "U",
  };

  const getLetterReplacement = (letter, replacements) => {
    const findKey = Object.keys(replacements).find((item) =>
      item.includes(letter)
    );
    return findKey ? replacements[findKey] : letter;
  };

  return text
    .split("")
    .map((letter) => getLetterReplacement(letter, sustitutions))
    .join("");
};

export default removeAccents;
