import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, durationSeconds: number) => void;
  onCancel: () => void;
}

export const AudioRecorder = ({ onRecordingComplete, onCancel }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000));
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      pausedTimeRef.current += Date.now() - startTimeRef.current;
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now();
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000));
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSave = () => {
    if (audioUrl && chunksRef.current.length > 0) {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      onRecordingComplete(audioBlob, recordingTime);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg">
        {!audioUrl ? (
          <>
            <div className="text-4xl font-mono text-primary">
              {formatTime(recordingTime)}
            </div>
            
            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg" className="gap-2">
                  <Mic className="w-5 h-5" />
                  Iniciar Gravação
                </Button>
              ) : (
                <>
                  {isPaused ? (
                    <Button onClick={resumeRecording} variant="outline" size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      Retomar
                    </Button>
                  ) : (
                    <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2">
                      <Pause className="w-5 h-5" />
                      Pausar
                    </Button>
                  )}
                  <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
                    <Square className="w-5 h-5" />
                    Parar
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex items-center gap-4 w-full">
              <Button onClick={togglePlayback} variant="outline" size="lg">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-mono text-primary">{formatTime(recordingTime)}</div>
                <div className="text-sm text-muted-foreground">Pré-visualização</div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button onClick={() => {
                setAudioUrl(null);
                setRecordingTime(0);
                chunksRef.current = [];
              }} variant="outline" className="flex-1">
                Gravar Novamente
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Salvar Áudio
              </Button>
            </div>
          </>
        )}
      </div>

      {!audioUrl && (
        <Button onClick={onCancel} variant="ghost" className="w-full">
          Cancelar
        </Button>
      )}
    </div>
  );
};
