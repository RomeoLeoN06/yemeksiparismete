using System;
using System.IO;

namespace yemeksiparismete.Server.Scratch
{
    public class ByteChecker
    {
        public static void Run()
        {
            string path = @"c:\Users\Monster\Desktop\yemeksiparismete\yemeksiparismete\yemeksiparismete.client\src\App.tsx";
            string[] lines = File.ReadAllLines(path);
            foreach (var line in lines)
            {
                if (line.Contains("order") && line.Contains("support"))
                {
                    Console.WriteLine($"Line: {line}");
                    foreach (char c in line)
                    {
                        Console.WriteLine($"Char: '{c}' ({(int)c})");
                    }
                }
            }
        }
    }
}
