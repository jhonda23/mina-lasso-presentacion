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
    
    // Evento cuando el video termina
    videoPlayer.addEventListener('ended', function() {
        console.log('Video terminado, mostrando redes sociales...');
        
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
    });
    
    // Evento para manejar errores del video
    videoPlayer.addEventListener('error', function(e) {
        console.error('Error al cargar el video:', e);
        alert('Error al cargar el video. Por favor, verifica que el archivo exista en la carpeta video/');
    });
});

// Función adicional para tracking (opcional)
function trackSocialClick(platform) {
    console.log(`Clic en ${platform}`);
    // Aquí puedes agregar Google Analytics o otro sistema de tracking
    // gtag('event', 'social_click', { 'platform': platform });
}