/**
 * 音频服务 - 管理应用中的声音效果
 */
class AudioService {
  private static instance: AudioService;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  // 单例模式
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * 加载声音文件
   * @param id 声音标识符
   * @param url 声音文件URL
   */
  public loadSound(id: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(id, audio);
  }

  /**
   * 播放声音
   * @param id 声音标识符
   */
  public playSound(id: string): void {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(id);
    if (sound) {
      // 克隆音频元素以允许重叠播放
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5; // 设置音量
      soundClone.play().catch(e => console.error('播放声音失败:', e));
    }
  }

  /**
   * 启用/禁用声音
   * @param enabled 是否启用声音
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 获取声音启用状态
   */
  public isEnabled(): boolean {
    return this.enabled;
  }
}

export default AudioService;
