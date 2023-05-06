package com.ersa.tracker.repositories.filestorage;

import com.ersa.tracker.repositories.FileRepository;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Log4j2
@Component
public class CachedFileRepository implements FileRepository {

    private final FileRepository delegate;
    private final LoadingCache<String, CachedFile> cache;

    public CachedFileRepository(FileRepository fileRepository) {
        delegate = fileRepository;
        cache = Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(100)
                .build((filename) ->
                        new CachedFile(filename, delegate.getFile(filename))
                );
    }

    @Override
    public boolean saveFile(String filename, InputStream inputStream) {
        boolean saved = delegate.saveFile(filename, inputStream);
        if (saved) {
            cache.invalidate(filename);
        }
        return saved;
    }

    @Override
    public boolean saveFile(String filename, InputStream inputStream, String contentType) {
        boolean saved = delegate.saveFile(filename, inputStream, contentType);
        if (saved) {
            cache.invalidate(filename);
        }
        return saved;
    }

    @Override
    public boolean fileExists(String filename) {
        return cache.asMap().keySet().stream().anyMatch((key) -> key == filename);
    }

    @Override
    public byte[] getFile(String filename) {
        CachedFile file = cache.get(filename);
        return file == null ? null : file.getData();
    }

    @Override //Not cached
    public String getResourceUrl(String filename) {
        return delegate.getResourceUrl(filename);
    }

    @Getter
    class CachedFile {
        public CachedFile(String filename, byte[] data) {
            this.data = data;
            this.filename = filename;
        }

        byte[] data;
        String filename;
    }
}
