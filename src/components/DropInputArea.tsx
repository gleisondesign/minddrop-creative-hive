
import { useState, useRef } from 'react';
import { DropType } from '@/types';
import Icon from './Icon';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface DropInputAreaProps {
  onAddDrop: (newDrop: { type: DropType; content: string; title?: string }) => void;
}

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const DropInputArea = ({ onAddDrop }: DropInputAreaProps) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleTextSubmit = () => {
    if (text.trim()) {
      const type = isValidUrl(text) ? 'link' : 'text';
      onAddDrop({ type, content: text.trim() });
      setText('');
    }
  };

  const handleAudioRecord = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          onAddDrop({ type: 'audio', content: audioUrl });
          audioChunks.current = [];
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Não foi possível acessar o microfone. Verifique as permissões.");
      }
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-8">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole um link, digite uma ideia ou arraste e solte um arquivo aqui..."
        className="w-full text-base"
        rows={3}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Button onClick={handleAudioRecord} variant="ghost" size="icon" className={isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground'}>
            <Icon name="Mic" className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {isRecording ? "Gravando..." : "Gravar áudio"}
          </span>
        </div>
        <Button onClick={handleTextSubmit} disabled={!text.trim()}>
          Adicionar Drop
        </Button>
      </div>
    </div>
  );
};

export default DropInputArea;
