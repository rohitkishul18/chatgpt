import { Component, NgZone } from '@angular/core';
import { ChatService } from '../chat.service';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: { role: string; content: string }[] = [];
  userInput: string = '';

  constructor(private chatService: ChatService,
    private ngZone: NgZone
  ) {
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ role: 'user', content: this.userInput });

    this.chatService.sendMessage(this.userInput).subscribe(
      res => {
        this.messages.push({ role: 'assistant', content: res.choices[0].message.content });
      },
      err => console.error(err)
    );

    this.userInput = '';
  }


  // startVoiceRecognition() {
  //   const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
  //   recognition.lang = 'en-US';
  //   recognition.interimResults = false;
  //   recognition.maxAlternatives = 1;

  //   recognition.onresult = (event: any) => {
  //     const transcript = event.results[0][0].transcript;

  //     // Ensure changes are detected immediately
  //     this.ngZone.run(() => {
  //       this.userInput = transcript;
  //       this.messages.push({ role: 'user', content: this.userInput }); // Add message instantly
  //       this.sendMessage();
  //     });
  //   };

  //   recognition.onerror = (event: any) => {
  //     alert('Error occurred in recognition: ' + event.error);
  //   };

  //   recognition.onend = () => {
  //     recognition.stop();
  //   };

  //   recognition.start();
  // }

  recognition: any; 
  isProcessing: boolean = false; 

  startVoiceRecognition() {
    // Stop previous recognition if running
    if (this.recognition) {
      this.recognition.stop();
    }

    this.recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    // Reset flag before starting
    this.isProcessing = false;

    this.recognition.onresult = (event: any) => {
      if (this.isProcessing) return; // Prevents duplicate message processing

      this.isProcessing = true; // Mark as processing to prevent duplicates
      const transcript = event.results[0][0].transcript;

      this.ngZone.run(() => {
        this.userInput = transcript;
        // this.messages.push({ role: 'user', content: this.userInput }); // Show user message once
        this.sendMessage(); 
      });
    };

    this.recognition.onerror = (event: any) => {
      alert('Error occurred in recognition: ' + event.error);
    };

    this.recognition.onend = () => {
      this.isProcessing = false; // Reset flag when recognition ends
      this.recognition.stop(); // Properly stop recognition
      this.recognition = null; // Reset instance
    };

    this.recognition.start();
  }

}
