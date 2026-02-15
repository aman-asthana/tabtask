package com.mednet.controller;

import com.mednet.model.Prefix;
import com.mednet.service.PrefixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prefix")
public class PrefixController {

    private final PrefixService prefixService;

    @Autowired
    public PrefixController(PrefixService prefixService) {
        this.prefixService = prefixService;
    }

    @GetMapping
    public List<Prefix> getAll() {
        return prefixService.listPrefixes();
    }

    @PostMapping
    public String create(@RequestBody Prefix p) {
        prefixService.addPrefix(p.getPrefix(), p.getName(), p.getGender(), p.getRelation());
        return "Saved";
    }

    @PutMapping("/{id}")
    public String update(@PathVariable int id, @RequestBody Prefix p) {
        prefixService.updatePrefix(id, p.getPrefix(), p.getName(), p.getGender(), p.getRelation());
        return "Updated";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        prefixService.deletePrefix(id);
        return "Deleted";
    }
}
