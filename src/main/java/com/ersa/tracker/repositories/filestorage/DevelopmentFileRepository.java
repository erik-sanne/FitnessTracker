package com.ersa.tracker.repositories.filestorage;

import com.ersa.tracker.repositories.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Only used for local development
 */
@Log4j2
@Component
@Profile("dev")
@Primary
@RequiredArgsConstructor
public class DevelopmentFileRepository implements FileRepository {

    Map<String, byte[]> cachedMap = new HashMap<>();

    @Override
    public boolean saveFile(String filename, InputStream inputStream) {
        return saveFile(filename, inputStream, "application/json");
    }

    @Override
    public boolean saveFile(String filename, InputStream inputStream, String contentType) {
        try {
            cachedMap.put(filename, inputStream.readAllBytes());
            return true;
        } catch (IOException exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean fileExists(String filename) {
        return cachedMap.containsKey(filename);
    }

    @Override
    public byte[] getFile(String filename) {
        if (!fileExists(filename))
            return null;
        return cachedMap.get(filename);
    }

    @Override
    public String getResourceUrl(String filename) {
        throw new RuntimeException("Not implemented");
    }
}
