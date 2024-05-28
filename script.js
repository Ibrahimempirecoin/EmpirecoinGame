document.addEventListener("DOMContentLoaded", () => {
    const coin = document.getElementById("coin");
    const scoreElement = document.getElementById("score");
    const energyCounter = document.getElementById("energyCounter");
    const energyBar = document.getElementById("energyBar");
    const friendsButton = document.getElementById("friendsButton");

    let score = parseInt(localStorage.getItem("score")) || 0;
    let energy = parseInt(localStorage.getItem("energy")) || 1500;
    const maxEnergy = 1500;

    // Генерация уникального userId, если его нет в localStorage
    if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", 'user_' + Date.now());
    }
    const userId = localStorage.getItem("userId");

    const updateUI = () => {
        scoreElement.textContent = score.toLocaleString();
        energyCounter.textContent = `${energy} / 1500`;
        energyBar.style.width = `${(energy / maxEnergy) * 100}%`;
    };

    const increaseEnergy = () => {
        if (energy < maxEnergy) {
            energy++;
            localStorage.setItem("energy", energy);
            updateUI();
        }
    };

    const decreaseEnergy = () => {
        if (energy > 0) {
            energy--;
            localStorage.setItem("energy", energy);
            return true;
        }
        return false;
    };

    const increaseScore = (amount = 1) => {
        score += amount;
        localStorage.setItem("score", score);
        updateUI();
    };

    coin.addEventListener("click", () => {
        if (decreaseEnergy()) {
            increaseScore();
        }
    });

    friendsButton.addEventListener("click", () => {
        const referralLink = `https://t.me/YourBot?start=referral_${userId}`;
        alert(`Share this referral link with your friends: ${referralLink}`);
    });

    updateUI();
    setInterval(increaseEnergy, 1000); // Увеличивать энергию каждую секунду

    // Check for referral in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('start')) {
        const referrerId = urlParams.get('start').split('_')[1];
        if (referrerId) {
            fetch('https://yourserver.com/referral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    referrerId: referrerId,
                    referredId: userId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    increaseScore(25000);
                    alert("You have received 25,000 points for using a referral link!");
                }
            });
        }
    }
});

