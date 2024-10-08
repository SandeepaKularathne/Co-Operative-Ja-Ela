package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Item {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Pattern(regexp = "^.*$", message = "Invalid Name")
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "sprice")
    @RegexPattern(reg = "^[0-9]+(\\.[0-9]{1,2})?$", msg = "Invalid price format.")
    private BigDecimal sprice;
    @Basic
    @Column(name = "pprice")
    @RegexPattern(reg = "^[0-9]+(\\.[0-9]{1,2})?$", msg = "Invalid price format.")
    private BigDecimal pprice;
    @Basic
    @Column(name = "poto")
    private byte[] poto;
    @Basic
    @Column(name = "quantity")
    @RegexPattern(reg = "^\\d+(,\\d+)*$", msg = "Invalid Quantity")
    private BigDecimal quantity;
    @Basic
    @Column(name = "rop")
    @RegexPattern(reg = "^\\d+(,\\d+)*$", msg = "Invalid Rop")
    private Integer rop;
    @Basic
    @Column(name = "dointroduced")
    private Date dointroduced;
    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "id", nullable = false)
    private Subcategory subcategory;
    @ManyToOne
    @JoinColumn(name = "itembrand_id", referencedColumnName = "id", nullable = false)
    private Itembrand itembrand;
    @ManyToOne
    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id", nullable = false)
    private Itemstatus itemstatus;
    @ManyToOne
    @JoinColumn(name = "unittype_id", referencedColumnName = "id", nullable = false)
    private Unittype unittype;
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    private Supplier supplier;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Poitem> poitems;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Grnitem> grnitems;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Disitem> disitems;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Iteminvoice> iteminvoices;
    @Basic
    @Column(name = "itemnumber")
    private String itemnumber;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Supreitem> supreitems;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Disorderitem> disorderitems;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Sritem> sritemsById;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Critem> critems;

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

    public BigDecimal getSprice() {
        return sprice;
    }

    public void setSprice(BigDecimal sprice) {
        this.sprice = sprice;
    }

    public BigDecimal getPprice() {
        return pprice;
    }

    public void setPprice(BigDecimal pprice) {
        this.pprice = pprice;
    }

    public byte[] getPoto() {
        return poto;
    }

    public void setPoto(byte[] poto) {
        this.poto = poto;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public Integer getRop() {
        return rop;
    }

    public void setRop(Integer rop) {
        this.rop = rop;
    }

    public Date getDointroduced() {
        return dointroduced;
    }

    public void setDointroduced(Date dointroduced) {
        this.dointroduced = dointroduced;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Item)) return false;
        Item item = (Item) o;
        return getId() == item.getId() && Objects.equals(getName(), item.getName()) && Objects.equals(getSprice(), item.getSprice()) && Objects.equals(getPprice(), item.getPprice()) && Arrays.equals(getPoto(), item.getPoto()) && Objects.equals(getQuantity(), item.getQuantity()) && Objects.equals(getRop(), item.getRop()) && Objects.equals(getDointroduced(), item.getDointroduced()) && Objects.equals(getSubcategory(), item.getSubcategory()) && Objects.equals(getItembrand(), item.getItembrand()) && Objects.equals(getItemstatus(), item.getItemstatus()) && Objects.equals(getUnittype(), item.getUnittype()) && Objects.equals(getSupplier(), item.getSupplier()) && Objects.equals(getPoitems(), item.getPoitems()) && Objects.equals(getGrnitems(), item.getGrnitems());
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(getId(), getName(), getSprice(), getPprice(), getQuantity(), getRop(), getDointroduced(), getSubcategory(), getItembrand(), getItemstatus(), getUnittype(), getSupplier(), getPoitems(), getGrnitems());
        result = 31 * result + Arrays.hashCode(getPoto());
        return result;
    }

    public Subcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(Subcategory subcategory) {
        this.subcategory = subcategory;
    }

    public Itembrand getItembrand() {
        return itembrand;
    }

    public void setItembrand(Itembrand itembrand) {
        this.itembrand = itembrand;
    }

    public Itemstatus getItemstatus() {
        return itemstatus;
    }

    public void setItemstatus(Itemstatus itemstatus) {
        this.itemstatus = itemstatus;
    }

    public Unittype getUnittype() {
        return unittype;
    }

    public void setUnittype(Unittype unittype) {
        this.unittype = unittype;
    }

//    public Collection<Disitem> getDisItems() {
//        return disitems;
//    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Collection<Poitem> getPoitems() {
        return poitems;
    }

    public void setPoitems(Collection<Poitem> poitems) {
        this.poitems = poitems;
    }

    public Collection<Grnitem> getGrnitems() {
        return grnitems;
    }

    public void setGrnitems(Collection<Grnitem> grnitems) {
        this.grnitems = grnitems;
    }

    public Collection<Iteminvoice> getIteminvoices() {
        return iteminvoices;
    }

    public void setIteminvoices(Collection<Iteminvoice> iteminvoices) {
        this.iteminvoices = iteminvoices;
    }

    public String getItemnumber() {
        return itemnumber;
    }

    public void setItemnumber(String itemnumber) {
        this.itemnumber = itemnumber;
    }

    public Collection<Supreitem> getSupreitems() {
        return supreitems;
    }

    public void setSupreitems(Collection<Supreitem> supreitems) {
        this.supreitems = supreitems;
    }

    public Collection<Disorderitem> getDisorderitems() {
        return disorderitems;
    }

    public void setDisorderitems(Collection<Disorderitem> disorderitems) {
        this.disorderitems = disorderitems;
    }

    public Collection<Sritem> getSritemsById() {
        return sritemsById;
    }

    public void setSritemsById(Collection<Sritem> sritemsById) {
        this.sritemsById = sritemsById;
    }

    public Collection<Critem> getCritems() {
        return critems;
    }

    public void setCritems(Collection<Critem> critems) {
        this.critems = critems;
    }
}
