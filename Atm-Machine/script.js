 //let Balance = 0.0;  // Initial balance is 0
        //const PIN = 4435;   // PIN matches your Java code

        function showScreen(screenId) {
            const screens = document.querySelectorAll('.screen-content');
            screens.forEach(screen => screen.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        }

        function clearPin() {
            document.getElementById('pin-input').value = '';
            document.getElementById('pin-message').innerHTML = '';
        }

        // Matches: public void checkpin()
        function checkPin() {
            const pin = parseInt(document.getElementById('pin-input').value);
            const messageDiv = document.getElementById('pin-message');
            
            if (pin === PIN) {
                messageDiv.innerHTML = '';
                menu();  // Call menu() like in Java
                clearPin();
            } else {
                messageDiv.innerHTML = '<div class="message error">Please enter the valid Pin</div>';
                document.getElementById('pin-input').value = '';
            }
        }

        // Matches: public void menu()
        function menu() {
            showScreen('menu-screen');
        }

        // Matches: public void CheckBalance()
        function checkBalance() {
            document.getElementById('balance-amount').textContent = Balance.toFixed(2);
            showScreen('balance-screen');
        }

        function showWithdraw() {
            document.getElementById('withdraw-input').value = '';
            document.getElementById('withdraw-message').innerHTML = '';
            showScreen('withdraw-screen');
        }

        function showDeposit() {
            document.getElementById('deposit-input').value = '';
            document.getElementById('deposit-message').innerHTML = '';
            showScreen('deposit-screen');
        }

        // Matches: public void withdrawMoney()
        function withdrawMoney() {
            const amount = parseFloat(document.getElementById('withdraw-input').value);
            const messageDiv = document.getElementById('withdraw-message');
            
            if (!amount || amount <= 0) {
                messageDiv.innerHTML = '<div class="message error">Please enter a valid amount</div>';
                return;
            }
            
            if (amount > Balance) {
                messageDiv.innerHTML = '<div class="message error">Insufficient Balance</div>';
                setTimeout(() => {
                    backToMenu();
                }, 2000);
            } else {
                Balance = Balance - amount;
                messageDiv.innerHTML = '<div class="message success">Money Withdraw Successfully</div>';
                setTimeout(() => {
                    backToMenu();
                }, 2000);
            }
        }

        // Matches: public void depositMoney()
        function depositMoney() {
            const amount = parseFloat(document.getElementById('deposit-input').value);
            const messageDiv = document.getElementById('deposit-message');
            
            if (!amount || amount <= 0) {
                messageDiv.innerHTML = '<div class="message error">Please enter a valid amount</div>';
                return;
            }
            
            Balance = Balance + amount;
            messageDiv.innerHTML = '<div class="message success">Money Deposited Successfully</div>';
            setTimeout(() => {
                backToMenu();
            }, 2000);
        }

        function backToMenu() {
            menu();  // Return to menu like in Java
        }

        // Matches: if(opt==4) return;
        function exitATM() {
            showScreen('exit-screen');
            setTimeout(() => {
                Balance = 0.0;  // Reset
                showScreen('pin-screen');
            }, 4000);
        }

        // Allow Enter key to submit PIN
        document.getElementById('pin-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPin();
            }
        });

        // Allow Enter key for withdraw
        document.addEventListener('DOMContentLoaded', function() {
            const withdrawInput = document.getElementById('withdraw-input');
            if (withdrawInput) {
                withdrawInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        withdrawMoney();
                    }
                });
            }

            const depositInput = document.getElementById('deposit-input');
            if (depositInput) {
                depositInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        depositMoney();
                    }
                });
            }
        });