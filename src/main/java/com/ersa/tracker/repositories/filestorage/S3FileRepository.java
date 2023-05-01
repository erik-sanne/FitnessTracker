package com.ersa.tracker.repositories.filestorage;

import com.ersa.tracker.repositories.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;

@Log4j2
@Component
@Profile("!dev")
@RequiredArgsConstructor
public class S3FileRepository implements FileRepository {

    @Value("${S3_STORAGE_BUCKET}")
    private String FILE_STORAGE_BUCKET;

    private final S3Client client;

    @Override
    public boolean saveFile(String filename, InputStream inputStream) {
        return saveFile(filename, inputStream, "application/json");
    }

    @Override
    public boolean saveFile(String filename, InputStream inputStream, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(FILE_STORAGE_BUCKET)
                .contentType(contentType)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .key(filename)
                .build();

        try {
            client.putObject(request,
                    RequestBody.fromInputStream(inputStream, inputStream.available()));
            log.info("Successfully uploaded file {}", filename);
            return true;
        } catch (IOException exception) {
            log.error("Failed to upload {}, {}", filename, exception);
            return false;
        }
    }

    @Override
    public boolean fileExists(String filename) {
        HeadObjectRequest request = HeadObjectRequest.builder()
                .bucket(FILE_STORAGE_BUCKET)
                .key(filename)
                .build();
        try {
            client.headObject(request);
            return true;
        } catch (NoSuchKeyException ex) {
            return false;
        }
    }

    @Override
    public byte[] getFile(String filename) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(FILE_STORAGE_BUCKET)
                .key(filename)
                .build();
        try {
            return client.getObject(request).readAllBytes();
        } catch (IOException exception) {
            log.error("Failed to read {}, {}", filename, exception);
            return null;
        }
    }

    @Override
    public String getResourceUrl(String filename) {
        GetUrlRequest request = GetUrlRequest.builder()
                .bucket(FILE_STORAGE_BUCKET)
                .key(filename)
                .build();
        return client.utilities().getUrl(request).toExternalForm();
    }
}
