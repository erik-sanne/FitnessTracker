package com.ersa.tracker.repositories;

import java.io.InputStream;

public interface FileRepository {
    boolean saveFile(String filename, InputStream inputStream);
    boolean saveFile(String filename, InputStream inputStream, String contentType);
    boolean fileExists(String filename);
    byte[] getFile(String filename);
    String getResourceUrl(String filename);
}
