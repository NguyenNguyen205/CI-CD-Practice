import upload_images
import create_music_table
import create_login_table


def main():
    create_login_table.put_login_items()
    create_music_table.load_music_items()
    upload_images.download_upload_s3() 

if __name__ == "__main__":
    main()