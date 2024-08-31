class Game {
    constructor() {
        this.heading = "FIFA Dünya Kupası";
        this.content = `FIFA Dünya Kupası, uluslararası alanda futboldan sorumlu en üst düzey yönetim organı olan Uluslararası Futbol Federasyonları Birliği 
        (FIFA) üyesi ülkelerin erkek millî takımlarının katılabildiği uluslararası futbol turnuvası. 
        1930'daki ilk turnuvadan beri, II. Dünya Savaşı sebebiyle gerçekleştirilemeyen 1942 ve 1946 yılları dışında dört yılda bir düzenlenmektedir.
        Turnuvanın geçerli statüsünde, turnuva öncesindeki üç yıl boyunca süren eleme aşaması vardır. 
        Günümüz itibarıyla FIFA üyesi 211 ülkenin katılabileceği elemeleri geçmeyi başaran takımlar, 
        FIFA Dünya Kupası Finalleri adını taşıyan final aşamasında mücadele eder. Finallerde, 
        o yılın turnuvasına ev sahipliği yapmasından ötürü eleme oynamaksızın direkt olarak katılan 
        ev sahibi ülke veya ülkelerle birlikte toplamda 32 millî takım yer alır. Dörder takımdan oluşan sekiz 
        gruba ayrılan katılımcılar, bu ilk aşamada grubundaki diğer takımlarla birer maç yaptıkları birinci turda 
        yarışır. Grupları ilk iki sırada tamamlayan takımlar, tek maçlı eleme sistemiyle gerçekleştirilen ikinci 
        aşamaya geçer. Final maçını kazanan takım şampiyon olurken üçüncülük takımı belirleme amacıyla yarı finalde 
        kaybeden 2 takım arasında bir üçüncülük maçı oynanır.`;
        this.headingWords = this.splitIntoWordsAndPunctuation(this.heading);
        this.contentWords = this.splitIntoWordsAndPunctuation(this.content);
        this.guessedWords = new Set();
        this.guessCount = 0;

        this.headingElement = document.getElementById('heading');
        this.contentElement = document.getElementById('content');
        this.guessInput = document.getElementById('guess-input');
        this.guessButton = document.getElementById('guess-button');
        this.scoreElement = document.getElementById('score-value');

        this.guessButton.addEventListener('click', () => this.makeGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });

        // Create a hidden element for measuring word widths
        this.measureElement = document.createElement('div');
        this.measureElement.id = 'word-measure';
        document.body.appendChild(this.measureElement);
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
                
                // Measure the width of the word
                this.measureElement.textContent = word;
                const width = this.measureElement.offsetWidth;
                
                wordElement.style.width = `${width}px`;
                wordElement.textContent = '\u00A0'.repeat(word.length); // Add non-breaking spaces
            } else {
                wordElement.textContent = word;
                wordElement.className = 'punctuation';
            }
            element.appendChild(wordElement);
            
            // Add space only if it's not the last word and the next item is not punctuation
            if (index < words.length - 1 && !/^[.:,;?!']$/.test(words[index + 1])) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    }

    makeGuess() {
        const guess = this.guessInput.value.toLowerCase().trim();
        if (guess && !this.guessedWords.has(guess)) {
            this.guessedWords.add(guess);
            this.guessCount++;
            this.scoreElement.textContent = this.guessCount;
            this.updateWords(this.headingElement, this.headingWords, guess);
            this.updateWords(this.contentElement, this.contentWords, guess);
            this.checkWinCondition();
        }
        this.guessInput.value = '';
    }

    updateWords(element, words, guess) {
        const wordElements = element.getElementsByClassName('word');
        Array.from(wordElements).forEach(wordElement => {
            const word = wordElement.dataset.word;
            if (word && word.toLowerCase() === guess.toLowerCase()) {
                wordElement.textContent = word;
                wordElement.classList.add('revealed');
            }
        });
    }

    checkWinCondition() {
        const revealedHeadingWords = this.headingWords.filter(word => 
            /^[\wğüşıöçĞÜŞİÖÇ]+$/.test(word) && this.guessedWords.has(word.toLowerCase())
        );
        const totalHeadingWords = this.headingWords.filter(word => /^[\wğüşıöçĞÜŞİÖÇ]+$/.test(word));
        if (revealedHeadingWords.length === totalHeadingWords.length) {
            alert(`Tebrikler! Makaleyi bildiniz: "${this.heading}". ${this.guessCount} tahminde bildiniz.`);
            this.guessButton.disabled = true;
            this.guessInput.disabled = true;
        }
    }
}