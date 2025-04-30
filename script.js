// API Key - Untuk pembelajaran, bisa diganti dengan API key sendiri
const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c'; // Ini contoh API key, bisa daftar gratis di openweathermap.org

// Elemen DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const loading = document.getElementById('loading');

// Event listener untuk tombol cari
searchBtn.addEventListener('click', searchWeather);

// Event listener untuk enter key
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Fungsi utama untuk mencari cuaca
function searchWeather() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        showError('Silakan masukkan nama kota');
        return;
    }
    
    showLoading();
    clearWeather();
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=id`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Kota tidak ditemukan');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            hideLoading();
        });
}

// Fungsi untuk menampilkan data cuaca
function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const { temp, feels_like, humidity, pressure } = main;
    const { description, icon } = weather[0];
    const { speed } = wind;
    const { country } = sys;
    
    const weatherHTML = `
        <div class="weather-card">
            <h2 class="city-name">${name}, ${country}</h2>
            
            <div class="weather-main">
                <div class="temperature">${Math.round(temp)}°C</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
            </div>
            
            <p class="weather-description">${description}</p>
            
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-temperature-low"></i>
                    <span>Terasa: ${Math.round(feels_like)}°C</span>
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span>Kelembapan: ${humidity}%</span>
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <span>Angin: ${speed} m/s</span>
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-compress-alt"></i>
                    <span>Tekanan: ${pressure} hPa</span>
                </div>
            </div>
        </div>
    `;
    
    weatherResult.innerHTML = weatherHTML;
}

// Fungsi untuk menampilkan error
function showError(message) {
    weatherResult.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>
    `;
}

// Fungsi untuk membersihkan tampilan cuaca
function clearWeather() {
    weatherResult.innerHTML = '';
}

// Fungsi untuk menampilkan loading
function showLoading() {
    loading.style.display = 'block';
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
    loading.style.display = 'none';
}

// Inisialisasi awal
clearWeather();
