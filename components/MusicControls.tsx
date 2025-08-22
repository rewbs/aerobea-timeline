'use client';

import { useRef, useState } from 'react';

export default function MusicControls() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const musicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  function initMusic() {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainRef.current = audioCtxRef.current.createGain();
    gainRef.current.connect(audioCtxRef.current.destination);
    gainRef.current.gain.value = 0.1;
  }

  function playChord(frequencies: number[], duration = 2000) {
    oscillatorsRef.current.forEach(osc => { try { osc.stop(); } catch {} });
    oscillatorsRef.current = [];
    frequencies.forEach(freq => {
      const osc = audioCtxRef.current!.createOscillator();
      const oscGain = audioCtxRef.current!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current!.currentTime);
      oscGain.gain.setValueAtTime(0, audioCtxRef.current!.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.3, audioCtxRef.current!.currentTime + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current!.currentTime + duration / 1000);
      osc.connect(oscGain);
      oscGain.connect(gainRef.current!);
      osc.start();
      osc.stop(audioCtxRef.current!.currentTime + duration / 1000);
      oscillatorsRef.current.push(osc);
    });
  }

  const toggleMusic = () => {
    if (!audioCtxRef.current) initMusic();
    if (musicPlaying) {
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
      oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
      setMusicPlaying(false);
    } else {
      const chords = [
        [261.63, 329.63, 392.0],
        [220.0, 261.63, 329.63],
        [174.61, 220.0, 261.63],
        [196.0, 246.94, 293.66],
        [164.81, 196.0, 246.94],
        [146.83, 174.61, 220.0]
      ];
      let chordIndex = 0;
      playChord(chords[chordIndex]);
      musicIntervalRef.current = setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        playChord(chords[chordIndex]);
      }, 3000);
      setMusicPlaying(true);
    }
  };

  const updateVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gainRef.current) {
      gainRef.current.gain.value = Number(e.target.value) / 1000;
    }
  };

  return (
    <div className="music-controls">
      <button onClick={toggleMusic}>{musicPlaying ? '🎵 Music: On' : '🎵 Music: Off'}</button>
      <div className="volume-control">
        <label>Volume: </label>
        <input type="range" min="0" max="100" defaultValue="30" onInput={updateVolume} style={{ width: '100px' }} />
      </div>
    </div>
  );
}
