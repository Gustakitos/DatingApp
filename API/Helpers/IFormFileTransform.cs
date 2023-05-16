public class IFormFileTransform
{
  public IFormFile GetFormFileFromPath(string imagePath)
  {
    // Read the image file as bytes
    byte[] fileBytes = File.ReadAllBytes(imagePath);

    // Create a MemoryStream from the file bytes
    using (MemoryStream memoryStream = new MemoryStream(fileBytes))
    {
      // Create an IFormFile instance
      IFormFile formFile = new FormFile(memoryStream, 0, fileBytes.Length, null, System.IO.Path.GetFileName(imagePath));

      return formFile;
    }
  }
}
