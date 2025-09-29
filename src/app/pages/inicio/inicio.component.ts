import { Component, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'hammerjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiServiceService } from '../../services/api-service.service';
import { HttpResponse } from '@angular/common/http';
//

//aos
import * as AOS from 'aos';
//

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in')
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class InicioComponent implements OnInit, OnDestroy, AfterViewInit{

  //TODO
  showOverlay: boolean = true;
  componentLoaded: boolean = false;
  isMuted: boolean = false;
  audio: any;
  formatAudioTime: any = '00:00';
  formatAudioEnd: any = '-00:00';

  duration: any;
  timer: any;
  percentage: any;

  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  countdownDate: any;

  _inputNombre: string = "";
  _inputCelular: string = "";
  _inputAsistencia: string = "";
  _inputMensaje: string = "";
  isLoadingForm: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private apiService: ApiServiceService
  ) {}

  ngOnInit(): void {

    //aos
    AOS.init();
    window.addEventListener('load', AOS.refresh);
    //

    this.disableScroll();
    window.scrollTo(0, 0);

    this.countdownDate = new Date('2025-10-24T14:00:00').getTime();
    // Immediately update countdown when component initializes
    this.updateCountdownDays();

    // Update countdown every second
    setInterval(() => {
      this.updateCountdownDays();
    }, 1000);

    // Asegurar que el overlay esté visible inmediatamente
    this.showOverlay = true;
    this.componentLoaded = false;

  }

  ngAfterViewInit() {
    this.scrollTop();
  }

  ngOnDestroy(): void {
    
  }

  confirmar(){
    // Evitar múltiples clics mientras está procesando
    if (this.isLoadingForm) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: "¿Deseas Confirmar tu invitación?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "confirmar",
      cancelButtonText: 'Aún no',
      confirmButtonColor: '#EC6697'
    }).then((result) => {

      if (result.isConfirmed) {

        if(this._inputNombre == ""){
          Swal.fire({
            icon: 'error',
            title: 'Recuerde ingresar su nombre',
            showConfirmButton: true,
            showCloseButton: false,
            confirmButtonColor: '#EC6697'
          });
          return;
        }

        if(this._inputCelular == ""){
          Swal.fire({
            icon: 'error',
            title: 'Recuerde ingresar su celular',
            showConfirmButton: true,
            showCloseButton: false,
            confirmButtonColor: '#EC6697'
          });
          return;
        }

        if(this._inputCelular.length < 9){
          Swal.fire({
            icon: 'error',
            title: 'El celular debe tener al menos 9 dígitos',
            showConfirmButton: true,
            showCloseButton: false,
            confirmButtonColor: '#EC6697'
          });
          return;
        }

        if(this._inputAsistencia == ""){
          Swal.fire({
            icon: 'error',
            title: 'Recuerde seleccionar si podrá asistir a nuestra boda',
            showConfirmButton: true,
            showCloseButton: false,
            confirmButtonColor: '#EC6697'
          });
          return;
        }



        const datos = {
          nombre: this._inputNombre,
          celular: this._inputCelular,
          asistencia: this._inputAsistencia,
          mensaje: this._inputMensaje
        }

        // Activar estado de loading
        this.isLoadingForm = true;

        try {
          this.apiService.registerDataNuevo(datos).subscribe(
            (response: any) => {
              // Desactivar estado de loading
              this.isLoadingForm = false;

              // Mostrar mensaje diferente según la asistencia
              const mensajeAsistencia = this._inputAsistencia === 'No' 
                ? 'Esperamos puedas asistir en este día tan especial para nosotros ❤️'
                : 'Asistencia confirmada, te esperamos el 24 de Octubre ❤️';

              Swal.fire({
                icon: 'success',
                title: mensajeAsistencia,
                showConfirmButton: true,
                showCloseButton: false,
                confirmButtonColor: '#EC6697'
              });
              
              this._inputNombre = "";
              this._inputCelular = "";
              this._inputAsistencia = "";
              this._inputMensaje = "";
            },
            (error: any) => {
              // Desactivar estado de loading
              this.isLoadingForm = false;
              console.log("error...", error);
              Swal.fire({
                icon: 'error',
                title: 'Error al enviar el mensaje',
                text: 'Por favor, inténtalo de nuevo',
                confirmButtonColor: '#EC6697'
              });
            }
          );
        } catch (error) {
          // Desactivar estado de loading
          this.isLoadingForm = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar los datos',
            text: 'No se pudo procesar la solicitud',
            confirmButtonColor: '#EC6697'
          });
        }


      } else if (result.isDenied) {
        
      }

    });
  }

  validateNumber(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateNombre(event: KeyboardEvent): void {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Prevent the default action (character insertion)
      event.preventDefault();
    }
  }

  scrollTop(){
    // Múltiples métodos para asegurar que el scroll funcione en todos los navegadores
    setTimeout(() => {
      // Método 1: window.scrollTo
      window.scrollTo(0, 0);
      
      // Método 2: document.documentElement.scrollTop
      document.documentElement.scrollTop = 0;
      
      // Método 3: document.body.scrollTop (para navegadores más antiguos)
      document.body.scrollTop = 0;
      
      // Método 4: scrollIntoView
      document.body.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  disableScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  enableScroll() {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  updateCountdownDays() {
    const now = new Date().getTime();
    const distance = this.countdownDate - now;

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Ensure countdown doesn't go below zero
    if (distance < 0) {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      }

}

  hideOverlay() {
    this.playSound();
    this.showOverlay = false;
    
    // Marcar el componente como cargado después de ocultar el overlay
    setTimeout(() => {
      this.componentLoaded = true;
      this.enableScroll();
      this.scrollTop();
    }, 50);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    // Si el audio no está inicializado, inicializarlo
    if (!this.audio) {
      this.playSound();
    } else {
      this.audio.muted = this.isMuted;
    }
    
    this.applyMuteState();
  }

  applyMuteState() {
    if (this.audio && this.audio.readyState >= 1) {
      this.audio.muted = this.isMuted;
    }
  }

  playSound() {
    this.audio = new Audio();
    this.audio.src = "../assets/audio/audio.mp3";
    // Asegurarse de que la metadata esté cargada antes de reproducir
    this.audio.addEventListener('loadedmetadata', () => {
      this.applyMuteState();
      this.audio.play();
      this.startTimer(); // Comenzar el temporizador para actualizar el tiempo cada segundo
    });

    // Aplicar el estado de mute cada vez que el audio empieza a reproducirse
    this.audio.addEventListener('play', () => {
      this.applyMuteState();
    });
  
    // Reiniciar la reproducción cuando termine el audio
    this.audio.addEventListener('ended', () => {
      clearInterval(this.timer); // Limpiar el intervalo existente
      this.playSound(); // Llamada recursiva para reiniciar la reproducción
    });
  
    // Cargar el audio
    this.audio.load();
  }

  startTimer() {
    // Limpiar cualquier intervalo existente
    clearInterval(this.timer);
  
    // Comenzar un nuevo intervalo para actualizar el tiempo cada segundo
    this.timer = setInterval(() => {
      this.calcularTime();
    }, 1000);
  }

  calcularTime() {
    const { currentTime, duration } = this.audio;
    this.tiempoTranscurrido(currentTime);
    this.tiempoRestante(currentTime, duration);
    this.setPercentage(currentTime, duration)
  }

  tiempoTranscurrido(currentTime: number) {
    let seconds = Math.floor(currentTime % 60);
    let minutes = Math.floor((currentTime / 60) % 60);
  
    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    this.formatAudioTime = `${displayMinutes}:${displaySeconds}`;
  }
  
  tiempoRestante(currentTime: number, duration: number): void {
    let timeLeft = duration - currentTime;
    let seconds = Math.floor(timeLeft % 60);
    let minutes = Math.floor((timeLeft / 60) % 60);
    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    this.formatAudioEnd = `-${displayMinutes}:${displaySeconds}`;
  }

  private setPercentage(currentTime: number, duration: number): void {
    this.percentage = (currentTime * 100) / duration;
  }

  showCancionesForm() {
    Swal.fire({
      title: "Ingresa el nombre de la canción y el cantante 😎 🎶",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        autocomplete: "off",
        maxlength: "50"
      },
      showCancelButton: true,
      confirmButtonText: "Registrar",
      showLoaderOnConfirm: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#769389",
      preConfirm: async (nombre_autor) => {
        if (!nombre_autor || nombre_autor.trim() === "") {
          Swal.fire({
            icon: 'error',
            title: 'Recuerde ingresar su canción y el cantante',
            showConfirmButton: true,
            showCloseButton: false,
            confirmButtonColor: '#769389'
          });
          return false; 
        }
  
        try {
          const _nombre_autor = { nombre: nombre_autor };
          return this.apiService.sendSongToGoogleSheets(_nombre_autor).toPromise();
        } catch (error) {
          Swal.showValidationMessage(`No se pudo guardar los datos`);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Tu música fue registrada, te esperamos el 24 de Octubre ❤️',
          showConfirmButton: true,
          showCloseButton: false,
          confirmButtonColor: '#769389'
        });
      }
    });
  }

  showDeseosForm() {
    Swal.fire({
      title: "Ingresa el mensaje que quieres enviar a los novios",
      html: `
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tu nombre:</label>
          <input id="nombre_autor" type="text" placeholder="Escribe tu nombre" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" maxlength="50" autocomplete="off">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tu mensaje:</label>
          <textarea id="mensaje" placeholder="Escribe tu mensaje para los novios" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; min-height: 80px;" maxlength="200" autocomplete="off"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Registrar",
      showLoaderOnConfirm: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#769389",
      preConfirm: async () => {
        const nombreAutor = (document.getElementById('nombre_autor') as HTMLInputElement).value.trim();
        const mensaje = (document.getElementById('mensaje') as HTMLTextAreaElement).value.trim();
        
        if (!nombreAutor) {
          Swal.showValidationMessage('Recuerde ingresar su nombre');
          return false; 
        }
        
        if (!mensaje) {
          Swal.showValidationMessage('Recuerde ingresar un mensaje');
          return false; 
        }
  
        try {
          const datos = { 
            nombre: nombreAutor,
            mensaje: mensaje
          };
          return this.apiService.sendDeseosToGoogleSheets(datos).toPromise();
        } catch (error) {
          Swal.showValidationMessage(`No se pudo guardar los datos`);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Tu mensaje para los novios fue registrado, te esperamos el 24 de Octubre ❤️',
          showConfirmButton: true,
          showCloseButton: false,
          confirmButtonColor: '#769389'
        });
      }
    });
  }

  openWhatsApp() {
    const message = "Hola Ruth! Confirmo mi asistencia a la boda de Cristian y Danitza";
    const encodedMessage = encodeURIComponent(message);
    
    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappUrl: string;
    
    if (isMobile) {
      // Para móviles usar wa.me que abre la app nativa
      whatsappUrl = `https://wa.me/924641277?text=${encodedMessage}`;
    } else {
      // Para PC usar WhatsApp Web
      whatsappUrl = `https://web.whatsapp.com/send?phone=924641277&text=${encodedMessage}`;
    }
    
    window.open(whatsappUrl, '_blank');
  }

}
