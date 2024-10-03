package com.example.SpringEcom.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.SpringEcom.model.Product;
import com.example.SpringEcom.repo.ProductRepo;

@Service
public class ProductService {

	@Autowired
	private ProductRepo repo;

	public List<Product> getAllProducts() {
		return repo.findAll();
	}

	public Product getProductById(int id) {
		return repo.findById(id).orElse(new Product(-1));
	}

	public Product addOrUpdateProduct(Product p, MultipartFile image) throws IOException {
		System.out.println(image.getOriginalFilename());
		p.setImageName(image.getOriginalFilename());
		p.setImageType(image.getContentType());
		p.setImageData(image.getBytes());
		return repo.save(p);
	}

	public void deleteProduct(int id) {
		repo.deleteById(id);
	}

	public List<Product> searchProducts(String keyword) {
		return repo.searchProducts(keyword);
	}

}
