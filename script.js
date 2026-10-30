// VIDEO / AUDIO
const dropZone=document.getElementById('dropZone'),fileInput=document.getElementById('fileInput'),previewContainer=document.getElementById('previewContainer'),videoPlayer=document.getElementById('videoPlayer'),audioPlayer=document.getElementById('audioPlayer'),fileNameEl=document.getElementById('fileName'),fileInfoEl=document.getElementById('fileInfo'),fileSizeEl=document.getElementById('fileSize'),fileTypeEl=document.getElementById('fileType'),errorMsg=document.getElementById('errorMsg');
let currentObjectURL=null;
const videoExts=['mp4','avi','mov','mkv','webm','flv','wmv','m4v','3gp','mpeg','mpg'],audioExts=['mp3','wav','ogg','flac','aac','wma','m4a','opus','aiff'];
function formatBytes(b){if(b===0)return'0 Bytes';const k=1024,sizes=['Bytes','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k));return parseFloat((b/Math.pow(k,i)).toFixed(2))+' '+sizes[i];}
function getExt(n){return n.split('.').pop().toLowerCase();}
function limpiarArchivo(){if(currentObjectURL)URL.revokeObjectURL(currentObjectURL);currentObjectURL=null;videoPlayer.pause();audioPlayer.pause();videoPlayer.src='';audioPlayer.src='';videoPlayer.classList.add('hidden');audioPlayer.classList.add('hidden');previewContainer.classList.add('hidden');errorMsg.classList.add('hidden');dropZone.style.display='';fileInput.value='';}
if(dropZone){dropZone.addEventListener('click',e=>{if(e.target.closest('button'))return;fileInput.click();});['dragenter','dragover'].forEach(evt=>dropZone.addEventListener(evt,e=>{e.preventDefault();dropZone.classList.add('dragover');}));['dragleave','drop'].forEach(evt=>dropZone.addEventListener(evt,e=>{e.preventDefault();dropZone.classList.remove('dragover');}));dropZone.addEventListener('drop',e=>{const f=e.dataTransfer.files;if(f.length>0)handleFile(f[0]);});fileInput.addEventListener('change',()=>{if(fileInput.files.length>0)handleFile(fileInput.files[0]);});}
function handleFile(file){errorMsg.classList.add('hidden');const ext=getExt(file.name),isVideo=file.type.startsWith('video/')||videoExts.includes(ext),isAudio=file.type.startsWith('audio/')||audioExts.includes(ext);if(currentObjectURL)URL.revokeObjectURL(currentObjectURL);currentObjectURL=URL.createObjectURL(file);fileNameEl.textContent=file.name;fileInfoEl.textContent='Cargado correctamente.';fileSizeEl.textContent='📦 '+formatBytes(file.size);fileTypeEl.textContent='🎞️ '+(file.type||ext.toUpperCase())+' (.'+ext+')';dropZone.style.display='none';previewContainer.classList.remove('hidden');videoPlayer.classList.add('hidden');audioPlayer.classList.add('hidden');videoPlayer.src='';audioPlayer.src='';if(isAudio&&!isVideo){audioPlayer.src=currentObjectURL;audioPlayer.classList.remove('hidden');audioPlayer.load();audioPlayer.play().catch(()=>{});}else{videoPlayer.src=currentObjectURL;videoPlayer.classList.remove('hidden');videoPlayer.load();videoPlayer.play().catch(()=>{});videoPlayer.onerror=()=>{videoPlayer.classList.add('hidden');audioPlayer.src=currentObjectURL;audioPlayer.classList.remove('hidden');audioPlayer.load();errorMsg.textContent='ℹ️ Reproducido como audio.';errorMsg.classList.remove('hidden');};}
previewContainer.scrollIntoView({behavior:'smooth',block:'center'});}
if(videoPlayer)videoPlayer.addEventListener('loadeddata',()=>fileInfoEl.textContent=`✅ Video listo (${videoPlayer.videoWidth}x${videoPlayer.videoHeight})`);
if(audioPlayer)audioPlayer.addEventListener('loadeddata',()=>fileInfoEl.textContent='✅ Audio listo');
window.limpiarArchivo=limpiarArchivo;
// IMPORTAR IMÁGENES INDIVIDUALMENTE EN CADA RECUADRO - PERSISTENTE
function restoreFotos(){
  document.querySelectorAll('.input-foto-jugador').forEach(input=>{
    const id=input.dataset.target;
    const saved=localStorage.getItem('foto_'+id);
    if(saved){
      const img=document.getElementById(id);
      if(img) img.src=saved;
    }
  });
}
document.addEventListener('DOMContentLoaded', restoreFotos);
document.querySelectorAll('.input-foto-jugador').forEach(input=>{
  input.addEventListener('change',()=>{
    const targetId=input.dataset.target;
    const img=document.getElementById(targetId);
    if(input.files[0] && img){
      const reader=new FileReader();
      reader.onload=e=>{
        const dataURL=e.target.result;
        img.src=dataURL;
        try{ localStorage.setItem('foto_'+targetId, dataURL); }catch(err){ console.warn('localStorage lleno',err); }
      };
      reader.readAsDataURL(input.files[0]);
    }
    input.value='';
  });
});
window.limpiarFotosGuardadas=function(){
  document.querySelectorAll('.input-foto-jugador').forEach(input=>{
    localStorage.removeItem('foto_'+input.dataset.target);
  });
  location.reload();
};
