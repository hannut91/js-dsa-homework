const getWords = (word) => {
  let tempWord = '';
  let words = [];

  for (let i = 0; i < word.length; i++) {
    if (word[i] !== ' ') {
      tempWord += word[i];

      continue;
    }

    if (tempWord.length > 0) {
      words.push(tempWord);
      tempWord = '';
    }
  }

  if (tempWord.length > 0) {
    words.push(tempWord);
  }

  return words;
};

const reverseWords = (originalWord) => {
  const words = getWords(originalWord);

  return words.reverse().join(' ');
};

test('reverseWords', () => {
  expect(reverseWords('I am a boy')).toBe('boy a am I');
  expect(reverseWords('Hi I am yunseok')).toBe('yunseok am I Hi');
});

describe('getWords', () => {
  describe('with normal text', () => {
    it('returns array of text', function () {
      expect(getWords('I am a boy')).toEqual(['I', 'am', 'a', 'boy']);
    });
  });

  describe('when space exist in front of sentence', () => {
    it('returns array of text', function () {
      expect(getWords(' I am a boy')).toEqual(['I', 'am', 'a', 'boy']);
    });
  });

  describe('when space exist in back of sentence', () => {
    it('returns array of text', function () {
      expect(getWords(' I am a boy ')).toEqual(['I', 'am', 'a', 'boy']);
    });
  });
});
