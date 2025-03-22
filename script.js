let currentPrice = 100;
let balance = 1000;
let priceData = [];
let chart;
let placedOrder = null; // The order the user places
let orderStatus = "No orders placed";
let orderType = "market"; // Default to market orders

// DOM elements
const currentPriceEl = document.getElementById('currentPrice');
const orderStatusEl = document.getElementById('orderStatus');
const balanceEl = document.getElementById('balance');
const orderPriceInput = document.getElementById('orderPrice');
const orderTypeSelect = document.getElementById('orderType');

// Random price generation
function generateRandomData() {
    priceData = [];
    let price = 100;  // starting price
    for (let i = 0; i < 100; i++) {
        price += (Math.random() - 0.5) * 2;  // random fluctuation
        price = Math.max(price, 1);  // prevent price from going negative
        priceData.push(price.toFixed(2));
    }
    updatePrice();
    plotChart();
}

// Update current price
function updatePrice() {
    currentPrice = parseFloat(priceData[priceData.length - 1]);
    currentPriceEl.textContent = `Current Price: $${currentPrice.toFixed(2)}`;
}

// Plot price chart
function plotChart() {
    if (chart) chart.destroy();  // Destroy previous chart if it exists

    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: priceData.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Price',
                data: priceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { 
                    title: { display: true, text: 'Time' } 
                },
                y: { 
                    title: { display: true, text: 'Price' },
                    min: Math.min(...priceData) - 5, 
                    max: Math.max(...priceData) + 5
                }
            }
        }
    });
}

// Order logic
function placeOrder() {
    const orderPrice = parseFloat(orderPriceInput.value);
    orderType = orderTypeSelect.value;

    if (isNaN(orderPrice) || orderPrice <= 0) {
        alert("Please enter a valid price for limit orders.");
        return;
    }

    if (orderType === 'market') {
        // Market order: Buy or sell immediately at the current price
        balance -= currentPrice;
        orderStatus = `Market Order Executed at $${currentPrice.toFixed(2)}`;
    } else if (orderType === 'limit') {
        // Limit order: Order will only execute if the price matches the specified price
        if (currentPrice >= orderPrice) {
            balance -= orderPrice;
            orderStatus = `Limit Order Executed at $${orderPrice.toFixed(2)}`;
        } else {
            orderStatus = `Limit Order Pending (Price too low)`;
        }
    }

    // Update stats
    orderStatusEl.textContent = `Order Status: ${orderStatus}`;
    balanceEl.textContent = `Balance: $${balance.toFixed(2)}`;
}

// Start the simulation
document.getElementById('startBacktest').addEventListener('click', () => {
    generateRandomData();
});

// Place an order (either market or limit)
document.getElementById('placeOrder').addEventListener('click', placeOrder);

// Simulate price movement over time
setInterval(() => {
    if (priceData.length > 0) {
        priceData.push(priceData[priceData.length - 1] + (Math.random() - 0.5) * 2);
        priceData = priceData.slice(1);  // Keep the data at a fixed length
        updatePrice();
    }
}, 1000);
