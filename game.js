class Game {
    constructor() {
        this.heading = "Avrupa Birliği";
        this.content = `Avrupa Birliği (AB), yirmi yedi üye ülkeden oluşan ve toprakları büyük ölçüde Avrupa kıtasında bulunan siyasi ve ekonomik bir örgütlenmedir. 1993 yılında, Avrupa Birliği Antlaşması olarak da bilinen Maastricht Antlaşması'nın yürürlüğe girmesi sonucu, var olan Avrupa Ekonomik Topluluğu'na yeni görev ve sorumluluk alanları yüklenmesiyle kurulmuştur. 445 milyondan fazla nüfusuyla Avrupa Birliği, dünya ülkelerinin GSYİH’ye (nominal) göre sıralanışında nominal gayrisafi yurtiçi hasılasının %30'luk bölümünü oluşturur.

Avrupa Birliği, tüm üye ülkeleri bağlayan standart yasalar aracılığıyla, insan, eşya, hizmet ve sermaye dolaşımı özgürlüklerini kapsayan bir ortak pazar (tek pazar) geliştirmiştir. Birlik içinde tarım, balıkçılık ve bölgesel kalkınma politikalarından oluşan ortak bir ticaret politikası izlenir. Birliğe üye ülkelerin yirmisi, Euro adıyla anılan ortak para birimini kullanmaya başlamıştır. Avrupa Birliği, üye ülkelerini Dünya Ticaret Örgütü'nde, G8 zirvelerinde ve Birleşmiş Milletler'de temsil ederek dış politikalarında da rol oynamaktadır. Birliğin yirmi yedi üyesinden yirmi biri NATO'nun da üyesidir. Schengen Antlaşması uyarınca birlik üyesi ülkeler arasında pasaport kontrolünün kaldırılmasının da arasında bulunduğu pek çok adlî konu ve içişleri düzenlemelerinde Avrupa Birliği'nin payı bulunur.

Avrupa Birliği, devletlerarası ve çok uluslu bir oluşumdur. Birlik içinde kimi konularda devletler arası anlaşma ve fikir birliği gerekir. Ancak belirli durumlarda uluslarüstü yönetim organları, üyelerin anlaşması olmaksızın da karara varabilir. Avrupa Birliği'nin bu tip haklara sahip önemli yönetim birimleri Avrupa Komisyonu, Avrupa Parlamentosu, Avrupa Birliği Konseyi, Liderler Zirvesi, Avrupa Adalet Divanı ve Avrupa Merkez Bankasıdır. Parlamentoyu, Avrupa Birliği vatandaşları beş yılda bir oylama yöntemiyle seçerler.

Avrupa Birliği'nin temelleri 1951 yılında, altı ülkenin katılımıyla oluşturulan Avrupa Kömür ve Çelik Topluluğu'na ve 1957 Roma Antlaşması'na dayanmaktadır. O dönemden bu yana, birlik yeni üyelerin katılımlarıyla boyut olarak büyümüş; var olan yetkilerine yeni görev ve sorumluluk alanları ekleyerek de gücünü arttırmıştır. Üye devletler Aralık 2007'de, birliğin bugüne dek yaptığı antlaşmalar ile yasal yapısını güncellemek ve iyileştirmek amacıyla Lizbon Antlaşması imzalanmıştır. Lizbon Antlaşması'nın onaylanma ve işleme girme sürecinin 2008 yılı içinde olması öngörülmüşse de İrlanda'da, antlaşmanın onaylanması için yapılan halk oylamasının ilk etapta olumsuz sonuçlanması kabul sürecini geciktirmiştir. Avrupa Birliği 2012 Nobel Barış Ödülünü almıştır.
`;
        
        this.headingWords = this.splitIntoWordsAndPunctuation(this.heading);
        this.contentWords = this.splitIntoWordsAndPunctuation(this.content);
        this.guessedWords = new Set();
        this.guessCount = 0;

        this.headingElement = document.getElementById('heading');
        this.contentElement = document.getElementById('content');
        this.guessInput = document.getElementById('guess-input');
        this.guessButton = document.getElementById('guess-button');
        this.scoreElement = document.getElementById('score-value');
        this.guessListElement = document.getElementById('guess-list');

        this.guessButton.addEventListener('click', () => this.makeGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });

        this.measureElement = document.createElement('div');
        this.measureElement.id = 'word-measure';
        document.body.appendChild(this.measureElement);

        this.alertElement = document.createElement('div');
        this.alertElement.id = 'custom-alert';
        document.body.appendChild(this.alertElement);

        this.trie = new Trie();
        this.isReady = false;
        this.loadWordList();
    }

    splitIntoWordsAndPunctuation(text) {
        return text.match(/[\wğüşıöçĞÜŞİÖÇ]+|[.:,;?!']/g).map(item => {
            if (item.length > 1 && /[.:,;?!']/.test(item[item.length - 1])) {
                return [item.slice(0, -1), item.slice(-1)];
            }
            return item;
        }).flat();
    }

    init() {
        this.renderWords(this.headingElement, this.headingWords);
        this.renderWords(this.contentElement, this.contentWords);
    }

    renderWords(element, words) {
        element.innerHTML = '';
        words.forEach((word, index) => {
            const wordElement = document.createElement('span');
            if (/^[\wğüşıöçĞÜŞİÖÇ]+$/.test(word)) {
                wordElement.className = 'word';
                wordElement.dataset.word = word;
                
                this.measureElement.textContent = word;
                const width = this.measureElement.offsetWidth;
                
                wordElement.style.width = `${width}px`;
                wordElement.textContent = '\u00A0'.repeat(word.length);
            } else {
                wordElement.textContent = word;
                wordElement.className = 'punctuation';
            }
            element.appendChild(wordElement);
            
            if (index < words.length - 1 && !/^[.:,;?!']$/.test(words[index + 1])) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    }

    makeGuess() {
        if (!this.isReady) {
            this.showAlert('Game is not ready yet. Please wait.');
            return;
        }

        const guess = this.guessInput.value.toLowerCase().trim();
        if (guess && !this.guessedWords.has(guess)) {
            if (this.trie.search(guess)) {
                this.guessedWords.add(guess);
                this.guessCount++;
                this.scoreElement.textContent = this.guessCount;

                const allWords = [...this.headingWords, ...this.contentWords];
                const matchingWords = allWords.filter(word => this.isPartialMatch(word.toLowerCase(), guess));
                const occurrences = matchingWords.length;

                if (occurrences > 0) {
                    this.updateWords(this.headingElement, this.headingWords, guess);
                    this.updateWords(this.contentElement, this.contentWords, guess);
                    this.showAlert(`'${guess}' maddede tam ${occurrences} kere geçiyor!`);
                } else {
                    this.showAlert(`'${guess}' maddede bulunmuyor.`);
                }

                this.addGuessToList(guess);
                this.checkWinCondition();
            } else {
                this.showAlert(`'${guess}' kelimesi sözlüğümüzde yok.`);
            }
        }
        this.guessInput.value = '';
    }

    isPartialMatch(word, guess) {
        if (guess.length < 4) {
            return word === guess;
        }
        return word.startsWith(guess);
    }

    updateWords(element, words, revealedWord) {
        const wordElements = element.getElementsByClassName('word');
        Array.from(wordElements).forEach(wordElement => {
            const word = wordElement.dataset.word;
            if (word && this.isPartialMatch(word.toLowerCase(), revealedWord.toLowerCase())) {
                wordElement.textContent = word;
                wordElement.classList.add('revealed');
            }
        });
    }

    addGuessToList(guess) {
        const guessElement = document.createElement('li');
        guessElement.textContent = guess;
        this.guessListElement.insertBefore(guessElement, this.guessListElement.firstChild);
    }

    checkWinCondition() {
        const revealedHeadingWords = this.headingWords.filter(word => 
            /^[\wğüşıöçĞÜŞİÖÇ]+$/.test(word) && 
            Array.from(this.guessedWords).some(guess => this.isPartialMatch(word.toLowerCase(), guess))
        );
        const totalHeadingWords = this.headingWords.filter(word => /^[\wğüşıöçĞÜŞİÖÇ]+$/.test(word));
        if (revealedHeadingWords.length === totalHeadingWords.length) {
            this.showAlert(`Tebrikler! Makaleyi bildiniz: "${this.heading}". ${this.guessCount} tahminde bildiniz.`);
            this.guessButton.disabled = true;
            this.guessInput.disabled = true;
        }
    }

    showAlert(message) {
        this.alertElement.textContent = message;
        this.alertElement.classList.add('show');
        setTimeout(() => {
            this.alertElement.classList.remove('show');
        }, 3000);
    }

    async loadWordList() {
        const url = 'https://raw.githubusercontent.com/ozgursarak/turkish_words/main/turkish_words.json';
        try {
            const response = await fetch(url);
            const words = await response.json();
            words.forEach(word => this.trie.insert(word.toLowerCase()));
            this.isReady = true;
            console.log('Word list loaded and trie constructed');
        } catch (error) {
            console.error('Error loading word list:', error);
        }
    }
}

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

    startsWith(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return true;
    }
}

// Create a new game instance when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});