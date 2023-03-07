function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 150,
      counterRoundSpecialAttack: 0,
      counterRoundHeal: 0,
      result: null,
    };
  },
  computed: {
    playerHealthBar() {
      return { width: this.playerHealth + "%" };
    },
    monsterHealthBar() {
      return { width: this.monsterHealth / 1.5 + "%" };
    },
  },
  watch: {
    monsterHealth() {
      if (this.monsterHealth > 0 && this.playerHealth <= 0) {
        this.result = "lose";
      } else if (this.monsterHealth <= 0 && this.playerHealth <= 0) {
        this.result = "draw";
      }
    },
    playerHealth() {
      if (this.playerHealth > 0 && this.monsterHealth <= 0) {
        this.result = "win";
      } else if (this.monsterHealth <= 0 && this.playerHealth <= 0) {
        this.result = "draw";
      }
    },
  },
  methods: {
    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 150;
      this.counterRoundSpecialAttack = 0;
      this.counterRoundHeal = 0;
      this.result = null;
    },
    attackMonester() {
      this.monsterHealth -= getRandomNumber(10, 12);
      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;
      }
      this.attackPlayer();
    },
    attackPlayer() {
      this.playerHealth -= getRandomNumber(7, 16);
      if (this.playerHealth <= 0) {
        this.playerHealth = 0;
      }
    },
    specialAttack() {
      this.counterRoundSpecialAttack++;
      this.monsterHealth -= getRandomNumber(25, 30);
      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;
      }
      this.attackPlayer();
    },
    healPlayer() {
      if (this.playerHealth < 100) {
        this.counterRoundHeal++;
        this.playerHealth += getRandomNumber(20, 35);
        if (this.playerHealth > 100) {
          this.playerHealth = 100;
        }
      }
    },
    surrendPlayer() {
      this.result = "lose";
    },
  },
}).mount("#game");
