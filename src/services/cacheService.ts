interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_EXPIRATION = 5 * 60 * 1000; 

  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${prefix}:${sortedParams}`;
  }


  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.expiresIn;
  }


  get<T>(key: string): T | null {
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data as T;
    }

    if (memoryEntry) {
      this.memoryCache.delete(key);
    }

    try {
      const localEntry = localStorage.getItem(key);
      if (localEntry) {
        const parsed: CacheEntry<T> = JSON.parse(localEntry);
        if (!this.isExpired(parsed)) {
          this.memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }

    return null;
  }


  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRATION): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn
    };

    this.memoryCache.set(key, entry);

    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      this.cleanExpiredEntries();
    }
  }

  
  delete(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error deleting from localStorage:', error);
    }
  }

 
  cleanExpiredEntries(): void {
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pokemon:')) {
          const entry = localStorage.getItem(key);
          if (entry) {
            try {
              const parsed: CacheEntry<any> = JSON.parse(entry);
              if (this.isExpired(parsed)) {
                keysToRemove.push(key);
              }
            } catch {
              keysToRemove.push(key);
            }
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Error cleaning localStorage:', error);
    }
  }

  clearAll(): void {
    this.memoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pokemon:')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }

 
  getPokemonList(limit: number, offset: number) {
    const key = this.generateKey('pokemon:list', { limit, offset });
    return this.get(key);
  }

  setPokemonList(limit: number, offset: number, data: any) {
    const key = this.generateKey('pokemon:list', { limit, offset });
    this.set(key, data, 10 * 60 * 1000); 
  }

  getPokemonByName(name: string) {
    const key = this.generateKey('pokemon:name', { name: name.toLowerCase() });
    return this.get(key);
  }

  setPokemonByName(name: string, data: any) {
    const key = this.generateKey('pokemon:name', { name: name.toLowerCase() });
    this.set(key, data, 15 * 60 * 1000); 
  }

  getPokemonById(id: number) {
    const key = this.generateKey('pokemon:id', { id });
    return this.get(key);
  }

  setPokemonById(id: number, data: any) {
    const key = this.generateKey('pokemon:id', { id });
    this.set(key, data, 15 * 60 * 1000); 
  }
}

export const cacheService = new CacheService();

cacheService.cleanExpiredEntries();
