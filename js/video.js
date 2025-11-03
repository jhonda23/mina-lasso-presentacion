// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const videoPlayer = document.getElementById('videoPlayer');
    const bgVideo = document.getElementById('bgVideo');
    const videoSection = document.getElementById('video-section');
    const socialSection = document.getElementById('social-section');
    
    // Verificar si los elementos existen
    if (!videoPlayer || !bgVideo || !socialSection) {
        console.error('Error: No se encontraron los elementos necesarios');
        return;
    }
    
    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Función para mostrar redes sociales
    function showSocialSection() {
        console.log('Mostrando redes sociales...');
        
        // Ocultar sección de video con animación
        videoSection.style.opacity = '0';
        videoSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            videoSection.style.display = 'none';
            
            // Mostrar sección de redes sociales
            socialSection.classList.add('active');
            
            // Agregar clase para animación adicional
            setTimeout(() => {
                socialSection.style.opacity = '1';
                socialSection.style.transform = 'translateY(0)';
            }, 100);
            
        }, 500);
    }
    
    // Función para reproducir videos automáticamente
    const playVideos = async () => {
        try {
            // Reproducir ambos videos automáticamente (sin sonido inicialmente)
            await bgVideo.play();
            await videoPlayer.play();
            console.log('Videos reproduciéndose automáticamente');
        } catch (error) {
            console.log('Error al reproducir automáticamente:', error);
        }
    };
    
    // Iniciar reproducción de videos
    playVideos();
    
    // SOLUCIÓN PARA MÓVILES: Verificar progreso del video cada segundo
    let checkInterval;
    videoPlayer.addEventListener('play', function() {
        checkInterval = setInterval(function() {
            // Si el video está cerca del final (último 2%)
            if (videoPlayer.duration > 0 && videoPlayer.currentTime >= videoPlayer.duration * 0.98) {
                console.log('Video cerca del final, mostrando redes sociales');
                clearInterval(checkInterval);
                showSocialSection();
            }
        }, 1000); // Verificar cada segundo
    });
    
    videoPlayer.addEventListener('pause', function() {
        if (checkInterval) clearInterval(checkInterval);
    });
    
    videoPlayer.addEventListener('ended', function() {
        if (checkInterval) clearInterval(checkInterval);
    });
    
    // SOLUCIÓN EXTRA: Botón de "Saltar" para móviles
    if (isMobile) {
        // Crear botón de saltar
        const skipButton = document.createElement('button');
        skipButton.innerHTML = '⏩ Saltar';
        skipButton.style.cssText = `
            position: absolute;
            bottom: 80px;
            right: 20px;
            background: rgba(255, 215, 0, 0.9);
            color: #001a33;
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 100;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        `;
        
        skipButton.addEventListener('click', function() {
            showSocialSection();
        });
        
        videoSection.appendChild(skipButton);
        
        // Ocultar botón cuando se muestren las redes sociales
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (videoSection.style.display === 'none') {
                    skipButton.style.display = 'none';
                }
            });
        });
        
        observer.observe(videoSection, { attributes: true, attributeFilter: ['style'] });
    }
    
    // Sincronizar videos
    videoPlayer.addEventListener('play', function() {
        bgVideo.currentTime = videoPlayer.currentTime;
        bgVideo.play();
    });
    
    videoPlayer.addEventListener('pause', function() {
        bgVideo.pause();
    });
    
    videoPlayer.addEventListener('seeked', function() {
        bgVideo.currentTime = videoPlayer.currentTime;
    });
    
    // Evento cuando el video termina (solución original)
    videoPlayer.addEventListener('ended', function() {
        console.log('Video terminado, mostrando redes sociales...');
        showSocialSection();
    });
    
    // Evento para manejar errores del video
    videoPlayer.addEventListener('error', function(e) {
        console.error('Error al cargar el video:', e);
        alert('Error al cargar el video. Por favor, verifica que el archivo exista en la carpeta video/');
    });
    
    // Timer de respaldo para móviles (en caso de que falle el evento ended)
    function startBackupTimer() {
        const videoDuration = videoPlayer.duration;
        if (videoDuration && !isNaN(videoDuration)) {
            setTimeout(function() {
                // Si después de la duración del video + 3 segundos aún no se ha mostrado las redes sociales
                if (!socialSection.classList.contains('active')) {
                    console.log('Timer de respaldo activado - Mostrando redes sociales');
                    showSocialSection();
                }
            }, (videoDuration * 1000) + 3000); // Duración del video + 3 segundos extra
        }
    }

    // Iniciar timer cuando el video tenga metadata
    videoPlayer.addEventListener('loadedmetadata', function() {
        startBackupTimer();
    });
});

// Función adicional para tracking (opcional)
function trackSocialClick(platform) {
    console.log(`Clic en ${platform}`);
    // Aquí puedes agregar Google Analytics o otro sistema de tracking
    // gtag('event', 'social_click', { 'platform': platform });
}