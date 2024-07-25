package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Supplier {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Name")
    private String name;
    @Basic
    @Column(name = "registernumber")
    @Pattern(regexp = "^([A-Z\\s]{1,3}\\d{6})$", message = "Invalid Registerion Number")
    private String registernumber;
    @Basic
    @Column(name = "doregister")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date doregister;
    @Basic
    @Column(name = "address")
    @Pattern(regexp = "^.*$", message = "Invalid Address")
    private String address;
    @Basic
    @Column(name = "officetp")
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobile Number")
    private String officetp;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid Email Address")
    private String email;
    @Basic
    @Column(name = "contactperson")
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Contact Person")
    private String contactperson;
    @Basic
    @Column(name = "contactnumber")
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobile Number")
    private String contactnumber;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Basic
    @Column(name = "doenter")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date doenter;
    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id", nullable = false)
    private Supplierstatus supplierstatus;
    @ManyToOne
    @JoinColumn(name = "supplierstype_id", referencedColumnName = "id", nullable = false)
    private Supplierstype supplierstype;

    @OneToMany(mappedBy = "supplier")
    private Collection<Supply> supplies;
    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private Collection<Item> items;
    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private Collection<Purorder> purorders;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegisternumber() {
        return registernumber;
    }

    public void setRegisternumber(String registernumber) {
        this.registernumber = registernumber;
    }

    public Date getDoregister() {
        return doregister;
    }

    public void setDoregister(Date doregister) {
        this.doregister = doregister;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getOfficetp() {
        return officetp;
    }

    public void setOfficetp(String officetp) {
        this.officetp = officetp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactperson() {
        return contactperson;
    }

    public void setContactperson(String contactperson) {
        this.contactperson = contactperson;
    }

    public String getContactnumber() {
        return contactnumber;
    }

    public void setContactnumber(String contactnumber) {
        this.contactnumber = contactnumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDoenter() {
        return doenter;
    }

    public void setDoenter(Date doenter) {
        this.doenter = doenter;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supplier supplier = (Supplier) o;
        return id == supplier.id && Objects.equals(name, supplier.name) && Objects.equals(registernumber, supplier.registernumber) && Objects.equals(doregister, supplier.doregister) && Objects.equals(address, supplier.address) && Objects.equals(officetp, supplier.officetp) && Objects.equals(email, supplier.email) && Objects.equals(contactperson, supplier.contactperson) && Objects.equals(contactnumber, supplier.contactnumber) && Objects.equals(description, supplier.description) && Objects.equals(doenter, supplier.doenter);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, registernumber, doregister, address, officetp, email, contactperson, contactnumber, description, doenter);
    }

    public Supplierstatus getSupplierstatus() {
        return supplierstatus;
    }

    public void setSupplierstatus(Supplierstatus supplierstatus) {
        this.supplierstatus = supplierstatus;
    }

    public Supplierstype getSupplierstype() {
        return supplierstype;
    }

    public void setSupplierstype(Supplierstype supplierstype) {
        this.supplierstype = supplierstype;
    }

    public Collection<Supply> getSupplies() {
        return supplies;
    }

    public void setSupplies(Collection<Supply> supplies) {
        this.supplies = supplies;
    }

    public Collection<Item> getItems() {
        return items;
    }

    public void setItems(Collection<Item> items) {
        this.items = items;
    }

    public Collection<Purorder> getPurorders() {
        return purorders;
    }

    public void setPurorders(Collection<Purorder> purorders) {
        this.purorders = purorders;
    }
}
