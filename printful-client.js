// printful-client.js - Frontend client for Custom Gear Mockups

document.addEventListener('DOMContentLoaded', () => {
    // Inject the modal HTML into the body dynamically
    const modalHTML = `
        <div id="printful-modal" class="fixed inset-0 z-50 hidden bg-black/95 backdrop-blur-md flex items-center justify-center p-6" style="margin:0;">
            <div class="bg-zinc-950 border-2 border-white/10 w-full max-w-2xl relative overflow-hidden brutalist-border p-8 md:p-12">
                <!-- Scanline Effect overlay -->
                <div class="absolute inset-0 pointer-events-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAECAYAAABP2FU6AAAAHklEQVQImWNkYGD4z8DAwMgAA0xMDEwM1BgYGAAEAAt3Avh4xW+qAAAAAElFTkSuQmCC')] opacity-20"></div>
                
                <button id="close-modal" class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer z-20">
                    <span class="material-symbols-outlined text-3xl">close</span>
                </button>

                <!-- UI Content -->
                <div class="relative z-10 flex flex-col items-center text-center">
                    <span class="material-symbols-outlined text-6xl text-accent-blue mb-4 animate-[pulse_2s_ease-in-out_infinite]">lock_open_right</span>
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-widest mb-2 text-white">SECURE UPLINK</h2>
                    <p class="text-zinc-400 text-xs md:text-sm font-mono mb-8 uppercase tracking-widest" id="modal-status">Establishing connection to Gateway...</p>

                    <!-- Progress Bar -->
                    <div class="w-full bg-zinc-900 border border-white/5 h-2 mb-8 overflow-hidden rounded-full">
                        <div id="progress-bar" class="bg-accent-blue h-full w-0 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,255,255,0.5)]"></div>
                    </div>

                    <!-- Dynamic Details -->
                    <div id="modal-content" class="hidden w-full text-left space-y-4 font-mono text-sm text-zinc-300">
                        <!-- Injected here via JS -->
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('printful-modal');
    const closeBtn = document.getElementById('close-modal');
    const statusBar = document.getElementById('modal-status');
    const progressBar = document.getElementById('progress-bar');
    const modalContent = document.getElementById('modal-content');

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        resetModal();
    });

    // Reset UI state
    function resetModal() {
        progressBar.style.width = '0%';
        progressBar.className = 'bg-accent-blue h-full w-0 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,255,255,0.5)]';
        statusBar.textContent = 'Establishing connection to Gateway...';
        statusBar.className = 'text-zinc-400 text-xs md:text-sm font-mono mb-8 uppercase tracking-widest';
        modalContent.className = 'hidden w-full text-left space-y-4 font-mono text-sm text-zinc-300';
        modalContent.innerHTML = '';
        document.body.style.overflow = ''; // Restore scrolling
    }

    // The function triggered by buttons
    window.launchPrintfulDesign = async function(productName, price) {
        document.body.style.overflow = 'hidden'; // Lock scrolling
        modal.classList.remove('hidden');
        
        // Step 1
        setTimeout(() => {
            progressBar.style.width = '30%';
            statusBar.textContent = 'Authorizing Store ID [17859738]...';
        }, 400);

        try {
            // Step 2
            setTimeout(() => {
                progressBar.style.width = '70%';
                statusBar.textContent = 'Fetching Printful Custom Object...';
            }, 1200);

            // Step 3 - Final "Loaded" State
            setTimeout(() => {
                progressBar.style.width = '100%';
                progressBar.classList.replace('bg-accent-blue', 'bg-green-500');
                progressBar.classList.replace('shadow-[0_0_15px_rgba(0,255,255,0.5)]', 'shadow-[0_0_15px_rgba(0,255,0,0.5)]');
                
                statusBar.textContent = 'SECURE TUNNEL ESTABLISHED';
                statusBar.classList.replace('text-zinc-400', 'text-green-500');
                statusBar.classList.add('font-bold');

                modalContent.classList.remove('hidden');
                modalContent.innerHTML = `
                    <div class="flex justify-between border-b border-white/10 pb-2">
                        <span class="text-zinc-500">TARGET EQUIPMENT:</span>
                        <span class="text-white font-black">${productName}</span>
                    </div>
                    <div class="flex justify-between border-b border-white/10 pb-2">
                        <span class="text-zinc-500">BASE PRICE:</span>
                        <span class="text-accent-blue font-black">${price}</span>
                    </div>
                    <div class="flex justify-between border-b border-white/10 pb-2">
                        <span class="text-zinc-500">API STATUS:</span>
                        <span class="text-green-500 animate-pulse">OK (AWAITING EMBEDDED MAKER)</span>
                    </div>
                    
                    <button class="w-full mt-8 bg-zinc-800 border border-zinc-700 text-zinc-400 py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-wait opacity-80" disabled>
                        <span>LOADING PRINTFUL EDITOR...</span>
                        <span class="material-symbols-outlined animate-spin">refresh</span>
                    </button>
                    <p class="text-center text-[10px] text-zinc-600 mt-2 uppercase tracking-widest">Integration requires Production Deployment & API Whitelist</p>
                `;
            }, 2000);

        } catch (error) {
            // Fallback UI error state
            progressBar.classList.replace('bg-accent-blue', 'bg-accent-red');
            progressBar.style.width = '100%';
            statusBar.textContent = 'CONNECTION FAILED: OFFLINE';
            statusBar.classList.replace('text-zinc-400', 'text-accent-red');
        }
    };
});
